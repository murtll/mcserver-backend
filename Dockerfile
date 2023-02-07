FROM node:17-stretch-slim

WORKDIR /app

RUN apt update && apt install build-essential python wget -y

COPY package.json ./
COPY yarn.lock ./

RUN yarn && yarn global add knex

COPY . .

CMD ["yarn", "start"]