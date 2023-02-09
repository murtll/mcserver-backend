FROM node:17-buster-slim

WORKDIR /app

RUN apt update && apt install build-essential python wget -y

COPY package.json ./
COPY yarn.lock ./

RUN yarn && yarn global add knex

COPY . .

RUN chmod +x *.sh

ENTRYPOINT ./entrypoint.sh