#!/bin/bash

# Quick Start Script for Design Document Builder
echo "🚀 Starting Design Document Builder..."

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Start backend server in background
echo "🔧 Starting backend server on port 3000..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server in background
echo "🎨 Starting frontend server on port 5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are starting up!"
echo ""
echo "📍 Application URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:3000/api/health"
echo ""
echo "💡 Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
