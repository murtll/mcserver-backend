FROM node:17-alpine

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn && yarn global add knex

COPY . .

RUN chmod +x *.sh

ENTRYPOINT ["./entrypoint.sh"]