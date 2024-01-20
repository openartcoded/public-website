FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

COPY public public

RUN npm i -g terser 
RUN terser --compress -o public/js/app.js --  public/js/app.js
RUN npm remove terser

COPY views views

COPY tailwind tailwind

COPY index.mjs index.mjs
COPY api.mjs api.mjs
COPY init.mjs init.mjs 

COPY tailwind.config.js tailwind.config.js

RUN npm run tailwind:minify

ENTRYPOINT [ "node", "index.mjs" ]
