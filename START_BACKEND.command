#!/bin/bash
cd "$(dirname "$0")/backend" || exit 1
echo "=========================================================="
echo " Starting SIH26092 Scheme Matcher Backend (FastAPI)"
echo " URL: http://127.0.0.1:8000"
echo " Docs: http://127.0.0.1:8000/docs"
echo "=========================================================="

if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi

python3 -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
