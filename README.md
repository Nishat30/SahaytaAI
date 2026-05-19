# 🧠 SahaytaAI— AI Educator for Differently-Abled Students

An adaptive AI tutor that personalizes content delivery based on the learner's needs — built for students with **Dyslexia**, **ADHD**, and **Visual Impairments**.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🤖 Adaptive AI Chat | Claude-powered tutor that rewrites content per disability profile |
| 📄 PDF Ingestion | Upload any study material — get an adapted summary instantly |
| 🔊 Text-to-Speech | Read-aloud button on every AI response |
| 🎮 Mind Games | 2 unique AI-generated games per disability type (6 total) |
| ⚡ Quick Prompts | One-tap starter questions per mode |
| 🎨 Beautiful UI | Accessible dark UI with Lexend + Atkinson Hyperlegible fonts |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Python
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **PDF**: PyPDF2
- **TTS**: Web Speech API (browser-native, no cost)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.10+
- An Anthropic API key → https://console.anthropic.com

---

### 1. Backend Setup

```bash
cd backend

# Copy env file
cp .env.example .env

# Edit .env and add your Anthropic API key
# ANTHROPIC_API_KEY=sk-ant-...

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

---

### 2. Frontend Setup

```bash
cd frontend

# Copy env file
cp .env.example .env.local

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at: http://localhost:3000

---

## 🎮 Mind Games

| Disability | Game 1 | Game 2 |
|---|---|---|
| Dyslexia | 🔤 Word Match | 🧩 Sentence Builder |
| ADHD | 🎯 Focus Finder | 🧠 Memory Sprint |
| Visual Impairment | 🔊 Audio Quiz | 🔢 Pattern Quest |

All games are **AI-generated** — new content every time you play!

---

## 📁 Project Structure

```
SahaytaAI/
├── backend/
│   ├── main.py          # FastAPI app
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── app/
    │   ├── page.tsx       # Landing / mode selector
    │   ├── learn/page.tsx # Chat + PDF upload
    │   └── games/page.tsx # Mind games
    ├── lib/api.ts         # API client
    └── ...config files
```

---

## 🏆 Hackathon Alignment

- **Domain**: Generative AI
- **Problem**: Differently-abled students receive no personalized support in standard classrooms
- **Solution**: AI that adapts content delivery style per disability profile
- **Impact**: Scalable to any school, any subject, any device
- **Innovation**: Per-disability prompt engineering + AI-generated adaptive games

---

Built with ❤️ for inclusive education.
