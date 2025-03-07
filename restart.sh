#!/bin/bash

echo "Killing existing Node.js and Python processes..."
pkill -f "node"
pkill -f "uvicorn"

echo "Waiting for processes to fully terminate..."
sleep 2

echo "Starting frontend server..."
cd frontend
PORT=3000 npm run dev &

echo "Starting backend server..."
cd ../backend/app
python3 -m uvicorn main:app --reload --port 8000 --host 0.0.0.0 &

echo "Servers restarted!"
echo "Frontend running on http://localhost:3000"
echo "Backend running on http://localhost:8000" 