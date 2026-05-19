from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from groq import Groq
import PyPDF2
import io
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SahaytaAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))

DISABILITY_PROMPTS = {
    "dyslexia": """You are an adaptive AI tutor for students with dyslexia. Follow these rules strictly:
- Use SHORT sentences (max 10 words each).
- Use SIMPLE, common words. Avoid jargon.
- Break content into tiny bullet points.
- Use lots of spacing and white space in your response.
- Highlight key words using bold font.
- Use analogies and real-world examples.
- Avoid walls of text.
- Use numbered steps for any process.
- Be encouraging and positive.
- Stop using asterick""",

    "adhd": """You are an adaptive AI tutor for students with ADHD. Follow these rules strictly:
- Break ALL content into micro-steps (1 action per step).
- Keep responses SHORT and punchy.
- Use emojis to add visual interest and energy 🎯✅🚀.
- Use numbered lists for everything.
- Bold the MOST important word in each sentence.
- Add a "Quick Summary" at the end (3 bullet points max).
- Use active, energetic language.
- Include a small motivational note at the end.
- Never give more than 3 concepts at once.
- Stop using asterick""",

    "visual": """You are an adaptive AI tutor for students with visual impairments. Follow these rules strictly:
- Describe everything in vivid, detailed verbal language.
- Never reference visual elements without describing them fully.
- Use spatial language carefully (e.g., "imagine a circle, now inside it...").
- Structure content with clear verbal headings like "SECTION 1:", "NEXT POINT:".
- Use rich analogies based on touch, sound, and other senses.
- Be extremely explicit and thorough — assume no visual context.
- Use clear logical flow: First... Then... Finally...
- Summarize at the end with key takeaways.
- Stop using asterick"""
}

GAME_PROMPTS = {
    "dyslexia": {
        "word_match": 'Generate a simple word matching game for dyslexia students. Return ONLY valid JSON with this exact structure: {"pairs": [{"word": "cat", "image_emoji": "🐱", "hint": "a furry pet"}]} with 6 pairs of simple 3-5 letter words with emojis and hints. No markdown, no explanation, just JSON.',
        "sentence_builder": 'Generate a sentence building exercise for dyslexia students. Return ONLY valid JSON: {"sentences": [{"words": ["The", "cat", "sat"], "correct_order": [0,1,2], "hint": "A cat is resting"}]} with 4 simple sentences of 3-5 words each. No markdown, no explanation, just JSON.'
    },
    "adhd": {
        "focus_challenge": 'Generate a focus challenge game for ADHD students. Return ONLY valid JSON: {"tasks": [{"task": "Find all the 🌟 stars", "items": ["🌟","🔴","🌟","🔵","🌟","🟢"], "target": "🌟", "count": 3, "time_seconds": 10}]} with 5 quick tasks. No markdown, no explanation, just JSON.',
        "memory_sprint": 'Generate a memory sprint game for ADHD students. Return ONLY valid JSON: {"rounds": [{"sequence": ["🔴","🔵","🟢"], "time_to_show": 2}]} with 4 rounds, sequences growing from 3 to 6 items. No markdown, no explanation, just JSON.'
    },
    "visual": {
        "audio_quiz": 'Generate an audio/verbal quiz for visually impaired students. Return ONLY valid JSON: {"questions": [{"question": "If you have 3 apples and give away 1, how many remain?", "options": ["1","2","3","4"], "answer": "2", "explanation": "3 minus 1 equals 2"}]} with 5 math/logic questions. No markdown, no explanation, just JSON.',
        "pattern_words": 'Generate a verbal pattern recognition game for visually impaired students. Return ONLY valid JSON: {"patterns": [{"sequence": "1, 3, 5, 7, ?", "answer": "9", "rule": "Add 2 each time", "hint": "Count up by two"}]} with 5 number/word patterns. No markdown, no explanation, just JSON.'
    }
}


class ChatRequest(BaseModel):
    message: str
    disability_type: str
    conversation_history: Optional[List[dict]] = []


class GameRequest(BaseModel):
    disability_type: str
    game_type: str


def groq_call(system_prompt: str, messages: list, max_tokens: int = 1000) -> str:
    """Single helper — always use Groq format, always return the text string."""
    full_messages = [{"role": "system", "content": system_prompt}] + messages
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",   # fast, free-tier Groq model
        max_tokens=max_tokens,
        messages=full_messages
    )
    return response.choices[0].message.content


@app.get("/")
def root():
    return {"message": "SahaytaAI API is running ✅"}


@app.post("/chat")
async def chat(request: ChatRequest):
    if request.disability_type not in DISABILITY_PROMPTS:
        raise HTTPException(status_code=400, detail="Invalid disability type")

    system_prompt = DISABILITY_PROMPTS[request.disability_type]
    messages = request.conversation_history + [
        {"role": "user", "content": request.message}
    ]

    text = groq_call(system_prompt, messages)
    return {
        "response": text,
        "disability_type": request.disability_type
    }


@app.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    disability_type: str = "dyslexia"
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    content = await file.read()
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
    text = ""
    for page in pdf_reader.pages[:5]:
        text += page.extract_text() + "\n"

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    system_prompt = DISABILITY_PROMPTS.get(disability_type, DISABILITY_PROMPTS["dyslexia"])
    prompt = f"Please summarize and explain this educational content in your adaptive style:\n\n{text[:3000]}"

    summary = groq_call(system_prompt, [{"role": "user", "content": prompt}])
    return {
        "summary": summary,
        "pages_processed": len(pdf_reader.pages),
        "disability_type": disability_type
    }


@app.post("/generate-game")
async def generate_game(request: GameRequest):
    if request.disability_type not in GAME_PROMPTS:
        raise HTTPException(status_code=400, detail="Invalid disability type")
    if request.game_type not in GAME_PROMPTS[request.disability_type]:
        raise HTTPException(status_code=400, detail="Invalid game type")

    prompt = GAME_PROMPTS[request.disability_type][request.game_type]
    system = "You are a game content generator. Return ONLY valid JSON, no markdown, no explanation, no backticks."

    raw = groq_call(system, [{"role": "user", "content": prompt}])
    raw = raw.strip()

    # Strip markdown fences if the model added them anyway
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    game_data = json.loads(raw)
    return {"game_data": game_data, "game_type": request.game_type}


@app.get("/disability-types")
def get_disability_types():
    return {
        "types": [
            {
                "id": "dyslexia",
                "label": "Dyslexia",
                "description": "Simplified text, short sentences, visual aids",
                "color": "#4F86C6",
                "emoji": "📖",
                "games": ["word_match", "sentence_builder"]
            },
            {
                "id": "adhd",
                "label": "ADHD",
                "description": "Micro-steps, energetic format, focus challenges",
                "color": "#F4A261",
                "emoji": "⚡",
                "games": ["focus_challenge", "memory_sprint"]
            },
            {
                "id": "visual",
                "label": "Visual Impairment",
                "description": "Audio-first, rich verbal descriptions, no visual references",
                "color": "#2A9D8F",
                "emoji": "🎧",
                "games": ["audio_quiz", "pattern_words"]
            }
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)