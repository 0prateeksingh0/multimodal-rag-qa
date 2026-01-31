import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
import faiss

import numpy as np
from openai import OpenAI
from app.core.config import settings
import os

class VectorService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.client = None
        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)
        self.dimension = 1536  # OpenAI embedding dimension
        self.indices = {} # Map file_id to FAISS index

    def _get_embedding(self, text: str):
        if not self.client:
            # Fallback for headless tests: return zero vector
            return np.zeros(self.dimension).astype('float32')
        
        response = self.client.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )
        return np.array(response.data[0].embedding).astype('float32')

    async def index_file(self, file_id: str, text: str):
        # Split text into chunks
        chunks = [text[i:i+1000] for i in range(0, len(text), 800)]
        if not chunks:
            return
        
        embeddings = []
        for chunk in chunks:
            emb = self._get_embedding(chunk)
            embeddings.append(emb)
        
        embeddings = np.array(embeddings).astype('float32')
        index = faiss.IndexFlatL2(self.dimension)
        index.add(embeddings)
        self.indices[file_id] = (index, chunks)

    async def search(self, file_id: str, query: str, top_k: int = 3) -> str:
        if file_id not in self.indices:
            return ""
        
        index, chunks = self.indices[file_id]
        query_emb = self._get_embedding(query).reshape(1, -1)
        distances, indices = index.search(query_emb, top_k)
        
        results = []
        for idx in indices[0]:
            if idx < len(chunks):
                results.append(chunks[idx])
        
        return "\n\n".join(results)

vector_service = VectorService()
