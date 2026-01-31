from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from app.core.config import settings
import uuid

from app.models.database import FileMetadata, Session, create_engine
from app.services.processor_service import processor_service
from app.services.llm_service import llm_service
from app.services.vector_service import vector_service
from app.services.storage_service import storage_service

router = APIRouter()
engine = create_engine(settings.DATABASE_URL)

ALLOWED_EXTENSIONS = {".pdf", ".mp3", ".wav", ".mp4", ".mkv", ".mov"}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="File type not supported")
    
    file_id = str(uuid.uuid4())
    filename = f"{file_id}{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Process file based on type
    text_content = ""
    transcription = None
    topics = []
    
    if file_ext == ".pdf":
        text_content = processor_service.extract_text_from_pdf(file_path)
    else:
        # Multimedia processing
        res = processor_service.transcribe_multimedia(file_path)
        transcription = res.get("text", "")
        text_content = transcription
        
        # Topic extraction from segments
        segments = res.get("segments", [])
        for seg in segments:
            # Simple topic extraction: use the first 50 chars of segment as topic for now
            # In a real app, you might use another LLM call to categorize segments
            topics.append({
                "topic": seg.get("text", "")[:50] + "...",
                "start": seg.get("start"),
                "end": seg.get("end")
            })
        
    # Index for vector search
    await vector_service.index_file(file_id, text_content)
        
    # Generate summary
    summary = await llm_service.get_summary(text_content[:4000]) # Limit for summary
    
    # Upload to Cloudinary if configured
    final_file_path = file_path
    if settings.CLOUDINARY_CLOUD_NAME:
        try:
            cloudinary_url = storage_service.upload_file(file_path, file_id)
            if cloudinary_url:
                final_file_path = cloudinary_url
        except Exception as e:
            print(f"Cloudinary upload failed: {e}")

    # Save to database
    with Session(engine) as session:
        file_meta = FileMetadata(
            file_id=file_id,
            filename=file.filename,
            file_path=final_file_path,
            file_type=file_ext[1:],
            summary=summary,
            transcription=transcription
        )
        session.add(file_meta)
        
        # Save topics
        from app.models.database import TopicTimestamp
        for t in topics:
            topic_ts = TopicTimestamp(
                file_id=file_id,
                topic=t["topic"],
                start_time=t["start"],
                end_time=t["end"]
            )
            session.add(topic_ts)
            
        session.commit()


    return {
        "file_id": file_id,
        "filename": file.filename,
        "summary": summary
    }

