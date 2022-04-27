FROM node:16.10-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

COPY public public

COPY views views

COPY index.js index.js

ENTRYPOINT [ "node", "index.js" ]