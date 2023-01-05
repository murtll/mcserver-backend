FROM node:17-stretch-slim

RUN apt update && apt install build-essential python wget -y

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

CMD ["yarn", "start"]