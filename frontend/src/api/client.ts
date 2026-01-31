import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
    baseURL: API_URL,
});

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await client.post('/api/upload', formData);
    return data;
};

export const chatWithFile = async (fileId: string, question: string) => {
    const { data } = await client.post('/api/chat', { file_id: fileId, question });
    return data;
};

export const getSummary = async (fileId: string) => {
    const { data } = await client.get(`/api/files/${fileId}/summary`);
    return data;
};

export const getTopics = async (fileId: string) => {
    const { data } = await client.get(`/api/files/${fileId}/topics`);
    return data;
};

export default client;
