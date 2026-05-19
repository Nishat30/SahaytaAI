#!/bin/bash
echo "🧠 Starting SahaytaAI..."

# Start backend
echo "📡 Starting FastAPI backend on port 8000..."
cd backend && uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
echo "🌐 Starting Next.js frontend on port 3000..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ SahaytaAI is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
