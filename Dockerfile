FROM node:17-stretch-slim

ENV PORT=3000

WORKDIR /app

RUN apt update && apt install build-essential python wget -y

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

CMD ["yarn", "start"]
