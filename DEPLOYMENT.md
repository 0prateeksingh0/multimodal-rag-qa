# Deployment Guide: AuraMind AI

This guide explains how to deploy the AuraMind AI application to production using **Render** for the backend and **Vercel** for the frontend.

## 1. Database & Redis (Render)

### PostgreSQL
1.  Log in to [Render](https://dashboard.render.com/).
2.  Click **New +** > **Database**.
3.  Name: `auramind-db`.
4.  Region: `Singapore (South)` (or your preferred region).
5.  Click **Create Database**.
6.  Copy the **Internal Database URL** for the backend.

### Redis
1.  Click **New +** > **Redis**.
2.  Name: `auramind-redis`.
3.  Plan: `Free` (or higher).
4.  Click **Create Redis**.
5.  Copy the **Internal Redis URL**.

---

## 2. Backend (Render)

### Setup
1.  Click **New +** > **Web Service**.
2.  Connect your GitHub repository.
3.  Name: `auramind-backend`.
4.  Root Directory: `backend`.
5.  Runtime: `Python`.
6.  Build Command: `pip install -r requirements.txt`.
7.  Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.

### Persistent Storage (CRITICAL for File Uploads)
Since Render has an ephemeral disk, your uploaded files will be deleted on restart unless you add a Disk.
1.  Go to **Advanced** > **Disks**.
2.  Name: `uploads`.
3.  Mount Path: `/app/uploads`.
4.  Size: `1GB` (Free tier limit).

### Environment Variables
Go to the **Environment** tab and add:
- `DATABASE_URL`: (Your Internal Database URL)
- `REDIS_URL`: (Your Internal Redis URL)
- `OPENAI_API_KEY`: (Your OpenAI Key)
- `UPLOAD_DIR`: `uploads`

---

## 3. Frontend (Vercel)

### Setup
1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New** > **Project**.
3.  Connect your GitHub repository.
4.  Framework Preset: `Vite`.
5.  Root Directory: `frontend`.

### Environment Variables
Add the following variable:
- `VITE_API_URL`: (The URL of your Render backend service, e.g., `https://auramind-backend.onrender.com`)

### Deployment
Click **Deploy**. Vercel will automatically build and host your frontend.

---

## 4. Final Verification
1.  Update your `frontend/src/api/client.ts` or set the `VITE_API_URL` variable in Vercel.
2.  Verify CORS settings in `backend/main.py`. The current `["*"]` value will work, but you can restrict it to your Vercel URL for better security.
