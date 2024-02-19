#!/bin/bash


# Check if variables are defined
check_variable() {
    if [ -z "${!1}" ]; then
        echo "ERROR: $1 variable must be defined, exiting"
        exit -1
    fi
}

# Check for required variables
check_variable "TAG"
check_variable "GITHUB_USERNAME"
check_variable "GITHUB_PASSWORD"
check_variable "BACKEND_DOMAIN"
check_variable "PORT"
check_variable "DATABASE_URL"
check_variable "WASP_WEB_CLIENT_URL"
check_variable "JWT_SECRET"
check_variable "ADS_SERVER_URL"
check_variable "STRIPE_KEY"
check_variable "PRO_SUBSCRIPTION_PRICE_ID"
check_variable "STRIPE_WEBHOOK_SECRET"


if [ ! -f key.pem ]; then
    echo "ERROR: key.pem file not found"
    exit -1
fi


ssh_command="ssh -o StrictHostKeyChecking=no -i key.pem azureuser@$BACKEND_DOMAIN"

echo "INFO: stopping already running docker container"
$ssh_command "docker stop wasp-backend || echo 'No containers available to stop'"
$ssh_command "docker container prune -f || echo 'No stopped containers to delete'"

echo "INFO: pulling docker image"
$ssh_command "echo $GITHUB_PASSWORD | docker login -u '$GITHUB_USERNAME' --password-stdin '$REGISTRY'"
$ssh_command "docker pull ghcr.io/$GITHUB_REPOSITORY:'$TAG'"
sleep 10

echo "Deleting old image"
$ssh_command "docker system prune -f || echo 'No images to delete'"

echo "INFO: starting docker container"
$ssh_command "docker run --name wasp-backend -p $PORT:$PORT -e PORT='$PORT' \
    -e DATABASE_URL='$DATABASE_URL' -e WASP_WEB_CLIENT_URL='$WASP_WEB_CLIENT_URL' \
	-e JWT_SECRET='$JWT_SECRET' -e GOOGLE_CLIENT_ID='$GOOGLE_CLIENT_ID' \
	-e GOOGLE_CLIENT_SECRET='$GOOGLE_CLIENT_SECRET' \
	-e ADS_SERVER_URL='$ADS_SERVER_URL' \
	-e STRIPE_KEY='$STRIPE_KEY' -e PRO_SUBSCRIPTION_PRICE_ID='$PRO_SUBSCRIPTION_PRICE_ID' \
	-e STRIPE_WEBHOOK_SECRET='$STRIPE_WEBHOOK_SECRET' -e ADMIN_EMAILS='$ADMIN_EMAILS' \
	-d ghcr.io/$GITHUB_REPOSITORY:$TAG"
