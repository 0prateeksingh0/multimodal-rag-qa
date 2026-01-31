import cloudinary
import cloudinary.uploader
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

class StorageService:
    def upload_file(self, file_path: str, public_id: str):
        """Uploads a file to Cloudinary and returns the secure URL."""
        response = cloudinary.uploader.upload(
            file_path,
            public_id=public_id,
            resource_type="auto" # Handles PDF, Audio, and Video
        )
        return response.get("secure_url")

storage_service = StorageService()
