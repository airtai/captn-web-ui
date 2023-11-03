#!/bin/bash


if test -z "$TAG"
then
	echo "ERROR: TAG variable must be defined, exiting"
	exit -1
fi

if test -z "$GITHUB_USERNAME"
then
	echo "ERROR: GITHUB_USERNAME variable must be defined, exiting"
	exit -1
fi

if test -z "$GITHUB_PASSWORD"
then
	echo "ERROR: GITHUB_PASSWORD variable must be defined, exiting"
	exit -1
fi


if [ ! -f key.pem ]; then
    echo "ERROR: key.pem file not found"
    exit -1
fi


if test -z "$BACKEND_DOMAIN"
then
	echo "ERROR: BACKEND_DOMAIN variable must be defined, exiting"
	exit -1
fi

if test -z "$PORT"
then
	echo "ERROR: PORT variable must be defined, exiting"
	exit -1
fi

if test -z "$DATABASE_URL"
then
	echo "ERROR: DATABASE_URL variable must be defined, exiting"
	exit -1
fi

if test -z "$WASP_WEB_CLIENT_URL"
then
	echo "ERROR: WASP_WEB_CLIENT_URL variable must be defined, exiting"
	exit -1
fi

if test -z "$JWT_SECRET"
then
	echo "ERROR: JWT_SECRET variable must be defined, exiting"
	exit -1
fi

echo "INFO: stopping already running docker container"
ssh -o StrictHostKeyChecking=no -i key.pem azureuser@"$BACKEND_DOMAIN" "docker stop wasp-backend || echo 'No containers available to stop'"
ssh -o StrictHostKeyChecking=no -i key.pem azureuser@"$BACKEND_DOMAIN" "docker container prune -f || echo 'No stopped containers to delete'"

echo "INFO: pulling docker image"
ssh -o StrictHostKeyChecking=no -i key.pem azureuser@"$BACKEND_DOMAIN" "echo $GITHUB_PASSWORD | docker login -u '$GITHUB_USERNAME' --password-stdin '$REGISTRY'"
ssh -o StrictHostKeyChecking=no -i key.pem azureuser@"$BACKEND_DOMAIN" "docker pull ghcr.io/$GITHUB_REPOSITORY:'$TAG'"
sleep 10

echo "Deleting old image"
ssh -o StrictHostKeyChecking=no -i key.pem azureuser@"$BACKEND_DOMAIN" "docker system prune -f || echo 'No images to delete'"

echo "INFO: starting docker container"
ssh -o StrictHostKeyChecking=no -i key.pem azureuser@"$BACKEND_DOMAIN" "docker run --name wasp-backend -e PORT=$PORT -e DATABASE_URL=$DATABASE_URL -e WASP_WEB_CLIENT_URL=$WASP_WEB_CLIENT_URL -e JWT_SECRET=$JWT_SECRET ghcr.io/$GITHUB_REPOSITORY:$TAG -d"
