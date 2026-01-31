from fastapi import APIRouter, HTTPException
from app.models.database import FileMetadata, TopicTimestamp, Session, create_engine, select
from app.core.config import settings
from typing import List

router = APIRouter()
engine = create_engine(settings.DATABASE_URL)

@router.get("/files/{file_id}/summary")
async def get_file_summary(file_id: str):
    with Session(engine) as session:
        statement = select(FileMetadata).where(FileMetadata.file_id == file_id)
        file_meta = session.exec(statement).first()
        
    if not file_meta:
        raise HTTPException(status_code=404, detail="File not found")
        
    return {
        "file_id": file_id,
        "filename": file_meta.filename,
        "summary": file_meta.summary,
        "file_type": file_meta.file_type
    }

@router.get("/files/{file_id}/topics")
async def get_file_topics(file_id: str):
    with Session(engine) as session:
        statement = select(TopicTimestamp).where(TopicTimestamp.file_id == file_id)
        topics = session.exec(statement).all()
        
    return topics
