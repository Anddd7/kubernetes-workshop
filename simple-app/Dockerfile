FROM node:alpine

WORKDIR /app

COPY package-lock.json ./

RUN npm install redis

COPY app.js ./

CMD [ "node", "app.js" ]