
FROM node:11-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./dist ./dist
COPY ./package.json ./package.json

RUN npm i --production

EXPOSE 8080

CMD npm run server-up
