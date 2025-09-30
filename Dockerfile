FROM alpine AS builder

RUN apk add --no-cache \
    curl \
    git \
    bash \
    npm \
    openssh \
    hugo

WORKDIR /site

COPY . .

RUN rm -rf public
RUN hugo  --environment production 

FROM nginx:1.29-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /site/public /usr/share/nginx/html/public

COPY nginx.conf /etc/nginx/nginx.conf
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80

