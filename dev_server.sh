#!/bin/bash

# Start the development server
# Runs frontends: npm start
# Runs backends: python3 app.py

# Start the frontend
cd frontend && npm start &
sleep 5 # Wait for the frontend to start

# Start the backend
cd backend && python3 app.py &
sleep 5 # Wait for the backend to start

# Wait for the user to exit
read -p "Press [Enter] to stop the server"

# Kill the frontend and backend
pkill -f "npm start"
pkill -f "python3 app.py"