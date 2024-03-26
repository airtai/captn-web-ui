ARG TAG

FROM ghcr.io/airtai/captn-web-ui:${TAG}

RUN apk add --no-cache py3-pip
COPY ws_ping.py scripts/start_service.sh ./
RUN pip install websockets

ENTRYPOINT []
CMD ["./start_service.sh"]
