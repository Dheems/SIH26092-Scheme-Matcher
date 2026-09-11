#!/bin/bash
cd "$(dirname "$0")/frontend" || exit 1
echo "=========================================================="
echo " Starting SIH26092 Scheme Matcher Frontend (Vite + React)"
echo " URL: http://localhost:5173"
echo "=========================================================="

npm run dev
