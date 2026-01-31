from sqlmodel import SQLModel, Field, create_engine, Session, select
from typing import Optional, List
from datetime import datetime

class FileMetadata(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    file_id: str = Field(index=True, unique=True)
    filename: str
    file_path: str
    file_type: str
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    summary: Optional[str] = None
    transcription: Optional[str] = None

class ChatMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    file_id: str = Field(index=True)
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class TopicTimestamp(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    file_id: str = Field(index=True)
    topic: str
    start_time: float
    end_time: float
