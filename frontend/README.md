# SahaytaAI Frontend

AI Educator for Differently-Abled Students — React + Tailwind UI

## Pages
- `/` — Landing page (hero, how it works, games preview, benefits)
- `/chat` — AI Tutor chat (select dyslexia / ADHD / visual mode)
- `/games` — Interactive mind games (AI-generated content)
- `/upload` — Upload PDF for adaptive summary

## Setup

```bash
npm install
npm start
```

## Backend
Make sure your Python FastAPI backend is running on `http://localhost:8000`.

```bash
cd ../backend
uvicorn main:app --reload --port 8000
```

## Notes
- All API calls go to `http://localhost:8000`
- Text-to-speech uses the browser's built-in Web Speech API
- Games are generated live from the backend AI
