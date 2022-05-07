FROM node:16.10-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

COPY public public

COPY views views

COPY tailwind tailwind

COPY index.mjs index.mjs
COPY api.mjs api.mjs

COPY tailwind.config.js tailwind.config.js

RUN npm run tailwind:minify

ENTRYPOINT [ "node", "index.mjs" ]