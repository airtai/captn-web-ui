#!/usr/bin/bash

# Start websocket ping
python3 /app/.wasp/build/server/ws_ping.py > /app/.wasp/build/server/ws_ping.log 2>&1 &
# tail -f /app/.wasp/build/server/ws_ping.log &

# Start node server
npm run start-production
