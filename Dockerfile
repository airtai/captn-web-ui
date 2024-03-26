ARG TAG

FROM ghcr.io/airtai/captn-web-ui:${TAG}

COPY ws_ping.py scripts/start_service.sh ./
RUN pip install websockets

ENTRYPOINT []
CMD ["./start_service.sh"]
