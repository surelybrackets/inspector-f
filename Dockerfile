
FROM node:11-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./dist ./dist
COPY ./package.json ./package.json
COPY ./lerna.json ./lerna.json

RUN npm run install:prod

EXPOSE 8080

CMD npm run server-up
