FROM node:18-slim AS build

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json yarn*.json ./

RUN yarn install

COPY ./src ./src

FROM build as development

ENV NODE_ENV=development

RUN yarn install --modules-folder="/app/node_modules"

RUN apt-get update \
    && apt-get install -y --no-install-recommends git
