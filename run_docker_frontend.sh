#!/bin/bash

ENCRYPT_SSL_FULLCHAIN_PATH="/home/ubuntu/etc/letsencrypt/live/nowsee.today/fullchain.pem"
ENCRYPT_SSL_PRIVKEY_PATH="/home/ubuntu/etc/letsencrypt/live/nowsee.today/privkey.pem"

CONTAINER_SSL_FULLCHAIN_PATH="/usr/app/ssl/fullchain.pem"
CONTAINER_SSL_PRIVKEY_PATH="/usr/app/ssl/privkey.pem"

sudo docker run -d --rm \
    --name "frontend" \
    -p 443:443 \
    -p 80:80 \
    -v $ENCRYPT_SSL_FULLCHAIN_PATH/:$CONTAINER_SSL_FULLCHAIN_PATH \
    -v $ENCRYPT_SSL_PRIVKEY_PATH/:$CONTAINER_SSL_PRIVKEY_PATH \
    -v /home/ubuntu/swppfall2022-team6/backend/media:/usr/app/build/media \
    frontend:latest bash