# AuraMind AI: Document & Multimedia Q&A

A full-stack web application that allows users to upload PDF documents, audio, and video files, and interact with an AI-powered chatbot to ask questions based on the content.

## Features
- **PDF Q&A**: Extract text and ask questions with context.
- **Multimedia Transcription**: Automatic transcription of audio/video using OpenAI Whisper.
- **Timestamp Mapping**: Jump to specific topics in audio/video based on AI-extracted timestamps.
- **Semantic Search**: Vector indexing with FAISS for accurate retrieval.
- **Premium UI**: Glassmorphic design with Framer Motion animations.

## Tech Stack
- **Backend**: FastAPI, SQLModel, PostgreSQL, Redis.
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion.
- **AI**: OpenAI GPT-4o & Whisper.

## Setup Instructions

### Prerequisites
- Docker & Docker Compose
- OpenAI API Key

### Running with Docker
1. Clone the repository.
2. Create a `.env` file in the root with your `OPENAI_API_KEY`.
3. Run:
   ```bash
   docker-compose up --build
   ```
4. Access the frontend at `http://localhost:5173`.

### Local Development (Backend)
1. `cd backend`
2. `python -m venv venv && source venv/bin/activate`
3. `pip install -r requirements.txt`
4. `uvicorn main:app --reload`

### Local Development (Frontend)
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## API Documentation
- **POST /api/upload**: Upload a file.
- **POST /api/chat**: Ask a question about a file.
- **GET /api/files/{id}/summary**: Get file summary.
- **GET /api/files/{id}/topics**: Get extracted topics.

## Testing
Run backend tests with coverage:
```bash
cd backend
pytest --cov=app tests/
```
Target coverage: 95%+

## Deployment
For instructions on how to deploy this application to Vercel and Render, please see the [Deployment Guide](DEPLOYMENT.md).

# multimodal-rag-qa

