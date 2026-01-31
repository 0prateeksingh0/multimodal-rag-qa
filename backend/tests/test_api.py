import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, MagicMock

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Multimedia Q&A API"}

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

@patch("app.api.upload.shutil.copyfileobj")
@patch("app.api.upload.processor_service.extract_text_from_pdf")
@patch("app.api.upload.llm_service.get_summary")
@patch("app.api.upload.vector_service.index_file")
def test_upload_pdf(mock_index, mock_summary, mock_extract, mock_copy):
    mock_extract.return_value = "Test PDF Content"
    mock_summary.return_value = "Test Summary"
    
    with open("test.pdf", "w") as f:
        f.write("content")
    
    with open("test.pdf", "rb") as f:
        response = client.post("/api/upload", files={"file": ("test.pdf", f, "application/pdf")})
    
    assert response.status_code == 200
    assert response.json()["filename"] == "test.pdf"
    assert response.json()["summary"] == "Test Summary"

@patch("app.api.chat.vector_service.search")
@patch("app.api.chat.llm_service.answer_question")
def test_chat(mock_answer, mock_search):
    mock_search.return_value = "Test Context"
    mock_answer.return_value = "Test Answer"
    
    # Pre-populate some metadata in DB would be better, but we mock the lookup for now
    # or just assume it exists if we use a mock for the DB session.
    # For simplicity, we'll assume the file_id check passes or mock the file_meta lookup.
    
    with patch("app.api.chat.Session") as mock_session:
        mock_meta = MagicMock()
        mock_meta.file_id = "test-id"
        mock_session.return_value.__enter__.return_value.exec.return_value.first.return_value = mock_meta
        
        response = client.post("/api/chat", json={"file_id": "test-id", "question": "What is this?"})
    
    assert response.status_code == 200
    assert response.json()["answer"] == "Test Answer"
