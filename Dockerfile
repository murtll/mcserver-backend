FROM node:17-stretch-slim

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start"]
