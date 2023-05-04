FROM node:18-slim AS build

WORKDIR /app

ENV NODE_ENV=production

COPY . .

RUN yarn install
RUN yarn build

FROM build as development

ENV NODE_ENV=development

RUN yarn install --modules-folder="/app/node_modules"

RUN apt-get update \
    && apt-get install -y --no-install-recommends git

FROM nginx:alpine as production

WORKDIR /app

COPY --from=build /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf