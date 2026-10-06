FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --allow-build=@tailwindcss/oxide --allow-build=core-js --allow-build=esbuild

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_BASE_IMAGE_URL
ARG VITE_CURRENCY
ARG VITE_BASE_URL
ARG VITE_APP_ENV

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_CURRENCY=$VITE_CURRENCY
ENV VITE_BASE_IMAGE_URL=$VITE_BASE_IMAGE_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

RUN pnpm build

FROM nginx:1-alpine-slim

RUN apk update && apk upgrade pcre2

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]