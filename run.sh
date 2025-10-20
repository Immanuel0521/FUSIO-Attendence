#!/bin/bash

echo "========================================"
echo "   WORKER ATTENDANCE MANAGEMENT SYSTEM"
echo "========================================"
echo ""
echo "This script will:"
echo "1. Install all dependencies"
echo "2. Start backend server (localhost:5000)"
echo "3. Start frontend server (localhost:3000)"
echo ""
echo "Press Ctrl+C to stop at any time"
echo ""

# Step 1: Install dependencies
echo "Step 1: Installing root dependencies..."
npm install

echo ""
echo "Step 2: Installing backend dependencies..."
cd backend
npm install

echo ""
echo "Step 3: Installing frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "Step 4: Starting servers..."
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Login credentials:"
echo "Username: admin"
echo "Password: admin123"
echo ""
echo "Press Ctrl+C to stop servers"
echo ""

cd ..
npx concurrently "npm run dev:backend" "npm run dev:frontend"
