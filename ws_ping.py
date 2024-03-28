import asyncio
import websockets
import time
import logging

from os import environ

# WebSocket server URL
ads_server_url = environ.get("ADS_SERVER_URL")
ads_server_domain = ads_server_url.split("://")[1]
SERVER_URL = f"wss://{ads_server_domain}:9090"

async def connect_to_server():
    try:
        async with websockets.connect(SERVER_URL) as websocket:
            await websocket.send("ping")
            msg = await websocket.recv()
            assert msg.strip() == "pong"
            current_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
            print(f"Connected successfully to server at {current_time}")
    except AssertionError:
        print(f"Error: Server did not respond with 'pong', instead got: {msg}")
    except Exception as e:
        print(f"Error connecting to server: {e}")

def main():
    while True:
        try:
            asyncio.run(connect_to_server())
        except Exception as e:
            print(f"Error running asyncio: {e}")
        time.sleep(60)  # Wait for 1 minute (60 seconds)

if __name__ == "__main__":
    main()
