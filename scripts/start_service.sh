#!/usr/bin/bash

# Start websocket ping
python3 ws_ping.py > ws_ping.log 2>&1 &
tail -f ws_ping.log &

# Start node server
npm run start-production
