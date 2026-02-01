from openai import OpenAI
from app.core.config import settings

class LLMService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.client = None
        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)

    async def get_summary(self, text: str) -> str:
        if not self.client:
            return "Summary unavailable: OpenAI API key not configured."
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "Summarize the text in 15 words or less."},
                    {"role": "user", "content": f"Summarize:\n\n{text}"}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error generating summary: {e}")
            return "Summary unavailable: OpenAI API error."

    async def answer_question(self, context: str, question: str, history: list = []) -> str:
        if not self.client:
            return "Answer unavailable: OpenAI API key not configured."
            
        messages = [
            {"role": "system", "content": "You are a helpful assistant. Use the provided context to answer the question. If the answer is not in the context, say you don't know."}
        ]
        # Add history here if needed
        messages.append({"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"})
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=messages
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error answering question: {e}")
            return "Answer unavailable: OpenAI API error."

llm_service = LLMService()
