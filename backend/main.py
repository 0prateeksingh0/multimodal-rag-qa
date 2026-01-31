from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api.upload import router as upload_router
from app.api.chat import router as chat_router
from app.api.summary import router as summary_router
from app.models.database import SQLModel, create_engine
from app.core.config import settings
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Multimedia Q&A API")

# Mount uploads directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Database initialization
engine = create_engine(settings.DATABASE_URL)

SQLModel.metadata.create_all(engine)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(upload_router, prefix="/api", tags=["upload"])
app.include_router(chat_router, prefix="/api", tags=["chat"])
app.include_router(summary_router, prefix="/api", tags=["summary"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Multimedia Q&A API"}




@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
