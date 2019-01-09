FROM node:8.15.0

RUN set -x \
    && apt-get update \
    && apt-get install -y vim git \
    && mkdir /webapp \
    && cd /webapp \
    && git clone https://github.com/knb-wkm/walter-02.git \
    && cd walter-02 \
    && git checkout develop \
    && cd client \
    && npm install

WORKDIR /webapp/client

EXPOSE 3000
    

