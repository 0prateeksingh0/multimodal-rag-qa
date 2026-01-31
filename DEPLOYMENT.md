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

### Persistent Storage (Optional but Recommended)
> [!IMPORTANT]
> Render's **Free Tier** does not support persistent disks. Files in `/app/uploads` will be deleted whenever the service restarts (which happens on every deploy). To keep files permanently, you need a paid plan (Starter or higher).
> 
#### How to add a Disk (Paid Plans Only):
1.  Open your **Web Service** (`auramind-backend`) in the Render Dashboard.
2.  In the left-hand sidebar menu, click on **Disks**.
3.  Click **Add Disk**.
4.  Name: `uploads`.
5.  Mount Path: `/app/uploads`.
6.  Size: `1GB`.

#### Recommended: Cloudinary (Free Persistent Storage)
Instead of a paid Render Disk, you can use Cloudinary. It's free and permanent.
1. Sign up at [Cloudinary.com](https://cloudinary.com/).
2. Copy your **Cloud Name**, **API Key**, and **API Secret** from the dashboard.
3. Add them to your Render environment variables (see below).

#### Alternative for Free Tier:
If you want to stay on the Free tier, any files uploaded will be temporary. For permanent storage without paying, consider integrating **Cloudinary** (for multimedia) or **AWS S3** later.

### Environment Variables
Go to the **Environment** tab and add:
- `DATABASE_URL`: (Your Internal Database URL)
- `REDIS_URL`: (Your Internal Redis URL)
- `OPENAI_API_KEY`: (Your OpenAI Key)
- `UPLOAD_DIR`: `uploads`
- `CLOUDINARY_CLOUD_NAME`: (Your Cloudinary Cloud Name)
- `CLOUDINARY_API_KEY`: (Your Cloudinary API Key)
- `CLOUDINARY_API_SECRET`: (Your Cloudinary API Secret)

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
