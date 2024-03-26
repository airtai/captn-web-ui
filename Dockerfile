ARG TAG

FROM ghcr.io/airtai/captn-web-ui:${TAG}

RUN apk add --no-cache py3-pip
COPY ws_ping.py scripts/start_service.sh /app/.wasp/build/server/
RUN pip install websockets

ENTRYPOINT []
CMD ["/app/.wasp/build/server/start_service.sh"]
