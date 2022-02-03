FROM node:17-stretch-slim

RUN apt update && apt install build-essential python -y

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3001

CMD ["yarn", "start"]
