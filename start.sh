#!/bin/bash

# Start the server in the background
echo "Starting server..."
cd /vercel/share/v0-project/zubi-magical-forest/server
npm install > /dev/null 2>&1
node server.js &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Start the client
echo "Starting client..."
cd /vercel/share/v0-project/zubi-magical-forest/client
npm install > /dev/null 2>&1
npm run dev

# Cleanup on exit
trap "kill $SERVER_PID" EXIT
