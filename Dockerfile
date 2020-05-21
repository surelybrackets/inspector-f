
FROM node:11-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./dist ./dist
COPY ./package.json ./package.json
COPY ./lerna.json ./lerna.json
COPY ./node_modules ./node_modules

EXPOSE 8080

CMD npm run server-up
