#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
echo "=========================================================="
echo " 🚀 Launching SIH26092 Scheme Matcher Full Stack Application"
echo " Project Directory: $DIR"
echo "=========================================================="

# Check Python and Node
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed or not in PATH."
    read -p "Press enter to exit..."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm / Node.js is not installed or not in PATH."
    read -p "Press enter to exit..."
    exit 1
fi

# Kill any existing instances on ports 8000 & 5173 to prevent EADDRINUSE
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

echo "1. Starting Backend Server on http://127.0.0.1:8000..."
cd "$DIR/backend" || exit 1
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi
python3 -m uvicorn app:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

echo "2. Starting Frontend Server on http://localhost:5173..."
cd "$DIR/frontend" || exit 1
npm run dev &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Wait a few moments for servers to start
sleep 2

echo "3. Opening default web browser..."
open "http://localhost:5173"

echo ""
echo "=========================================================="
echo " Application is running!"
echo " • Frontend: http://localhost:5173"
echo " • Backend:  http://127.0.0.1:8000"
echo " • API Docs: http://127.0.0.1:8000/docs"
echo "=========================================================="
echo " Press Ctrl+C in this terminal to stop both servers."
echo "=========================================================="

# Trap SIGINT / SIGTERM to gracefully shut down both background servers
trap "kill -9 $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Servers stopped.'; exit 0" SIGINT SIGTERM EXIT

wait
