import os
from pypdf import PdfReader
from app.core.config import settings
import whisper_timestamped as whisper

class ProcessorService:
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> str:
        if not os.path.exists(file_path):
            return ""
        
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text

    @staticmethod
    def transcribe_multimedia(file_path: str) -> dict:
        # This will use whisper-timestamped for transcription and timestamps
        if not os.path.exists(file_path):
            return {}
        
        # Note: In production, this should be done asynchronously
        audio = whisper.load_audio(file_path)
        model = whisper.load_model("base", device="cpu")
        result = whisper.transcribe(model, audio, language="en")
        
        return result

processor_service = ProcessorService()
