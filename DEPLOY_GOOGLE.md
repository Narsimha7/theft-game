# Deploying to Google Guide

Your frontend is fully static, lightweight, fast, and optimized for Google web hosting. Here are the simplest and best ways to deploy it on Google.

---

## Option 1: Google Firebase Hosting (Recommended - 100% Free & Takes 2 Mins)

Google Firebase Hosting is Google's official platform for frontend single-page and static web applications. It includes free global CDN distribution, automatic HTTPS SSL certificates, and custom domains.

### Step-by-Step Instructions:

1. **Install Firebase CLI** (requires Node.js):
   ```powershell
   npm install -g firebase-tools
   ```

2. **Sign in to your Google Account**:
   ```powershell
   firebase login
   ```

3. **Initialize Firebase in this folder** (we already created `firebase.json` for you!):
   ```powershell
   firebase init hosting
   ```
   - When asked *"Use an existing project or create a new project?"*, select your preferred option.
   - When asked *"What do you want to use as your public directory?"*, enter `.` (current directory) or press Enter.
   - When asked *"Configure as a single-page app?"*, answer **Yes** (`y`).
   - When asked *"Set up automatic builds and deploys with GitHub?"*, choose **No** (`N`) for now (or Yes if using GitHub).
   - When asked *"Overwrite index.html?"*, select **No** (`N`).

4. **Deploy to Google**:
   ```powershell
   firebase deploy
   ```

Your site will immediately be live on a secure Google URL:
`https://<your-project-id>.web.app` and `https://<your-project-id>.firebaseapp.com`!

---

## Option 2: Google App Engine (Google Cloud Platform)

If you use the standard Google Cloud Platform (GCP) Console or `gcloud` CLI:

1. **Install Google Cloud SDK** (if not already installed):
   Download from [cloud.google.com/sdk](https://cloud.google.com/sdk).

2. **Authenticate with Google**:
   ```powershell
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Deploy with 1 command** (we already generated `app.yaml` for you):
   ```powershell
   gcloud app deploy
   ```

4. View your live site:
   ```powershell
   gcloud app browse
   ```

---

## Option 3: Google Cloud Run (Serverless Container)

If you prefer Google Cloud Run:

1. **Deploy directly with source**:
   ```powershell
   gcloud run deploy covert-council --source . --platform managed --allow-unauthenticated --region us-central1
   ```

Google Cloud will automatically build the included `Dockerfile` and give you a live HTTPS URL.

---

## Summary of Included Files:
- [index.html](file:///c:/Users/Chidu/OneDrive/Desktop/imposter/index.html) – The main production entry point.
- [code.html](file:///c:/Users/Chidu/OneDrive/Desktop/imposter/code.html) – Synced backup of the front end.
- [firebase.json](file:///c:/Users/Chidu/OneDrive/Desktop/imposter/firebase.json) – Pre-configured Firebase hosting configuration.
- [.firebaserc](file:///c:/Users/Chidu/OneDrive/Desktop/imposter/.firebaserc) – Firebase project settings.
- [app.yaml](file:///c:/Users/Chidu/OneDrive/Desktop/imposter/app.yaml) – Google App Engine static deployment config.
- [Dockerfile](file:///c:/Users/Chidu/OneDrive/Desktop/imposter/Dockerfile) – Lightweight Nginx container for Google Cloud Run.
