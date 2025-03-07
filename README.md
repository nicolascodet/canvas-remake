# Canvas Student Remake

A recreation of the Canvas Learning Management System for students, featuring a Python FastAPI backend and Next.js frontend.

## Project Structure

- `/backend`: Python FastAPI backend
  - `/app`: Main application code
  - `requirements.txt`: Python dependencies
  - `Dockerfile`: Container configuration for Google Cloud Run

- `/frontend`: Next.js frontend application

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the development server:
   ```
   cd app
   uvicorn main:app --reload
   ```

5. The API will be available at http://localhost:8000
   - Interactive documentation: http://localhost:8000/docs

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. The frontend will be available at http://localhost:3000

## Deployment to Google Cloud Run

### Backend Deployment

1. Build the Docker image:
   ```
   cd backend
   gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/canvas-backend
   ```

2. Deploy to Cloud Run:
   ```
   gcloud run deploy canvas-backend --image gcr.io/[YOUR_PROJECT_ID]/canvas-backend --platform managed
   ```

### Frontend Deployment

1. Build the Next.js application:
   ```
   cd frontend
   npm run build
   ```

2. Deploy using your preferred hosting method (Vercel, Netlify, etc.)

## Features

- Dashboard with upcoming assignments, events, and announcements
- Course list and details
- Assignment tracking
- Calendar integration
- Notifications

## License

MIT 