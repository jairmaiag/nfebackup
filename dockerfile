FROM node:16-alpine
RUN apk update

WORKDIR /app

COPY package.json .

RUN npm install
