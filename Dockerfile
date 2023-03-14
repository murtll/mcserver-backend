FROM node:17-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn && yarn global add knex

COPY . .

RUN chmod +x *.sh

ENTRYPOINT ["./entrypoint.sh"]