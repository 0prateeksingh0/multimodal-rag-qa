from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.llm_service import llm_service
from app.services.vector_service import vector_service
from app.models.database import FileMetadata, Session, create_engine, select
from app.core.config import settings

router = APIRouter()
engine = create_engine(settings.DATABASE_URL)

class ChatRequest(BaseModel):
    file_id: str
    question: str

@router.post("/chat")
async def chat(request: ChatRequest):
    # Get file metadata
    with Session(engine) as session:
        statement = select(FileMetadata).where(FileMetadata.file_id == request.file_id)
        file_meta = session.exec(statement).first()
        
    if not file_meta:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Use vector search for context
    context = await vector_service.search(request.file_id, request.question)
    
    if not context:
        # Fallback to full transcription/text if indexing failed or small file
        context = file_meta.transcription or file_meta.summary or ""

    answer = await llm_service.answer_question(context, request.question)
    
    return {
        "answer": answer,
        "context_used": context[:200] + "..." if context else ""
    }
