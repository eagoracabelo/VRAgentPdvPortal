FROM node:20.16.0-alpine AS build

ENV NODE_ENV=development \
  NODE_OPTIONS=--max-old-space-size=8192 \
  TZ=America/Sao_Paulo \
  LANG=pt_BR.utf8 \
  LC_ALL=pt_BR.utf8 \
  LANGUAGE=pt_BR.utf8

RUN apk update && apk add --no-cache \
  bash \
  musl \
  musl-utils \
  musl-locales \
  tzdata \
  jq \
  && cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime \
  && echo "America/Sao_Paulo" > /etc/timezone \
  && echo 'export LC_ALL=pt_BR.UTF-8' >> /etc/profile.d/locale.sh \
  && sed -i 's|LANG=C.UTF-8|LANG=pt_BR.UTF-8|' /etc/profile.d/locale.sh \
  && rm -rf /var/cache/apk/*

RUN npm i -g @angular/cli@18.2.12 gulp-cli@3.0.0 gulp@5.0.0


WORKDIR /app

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=${GITHUB_TOKEN}

COPY package*.json ./

RUN echo "@vrui:registry=https://npm.pkg.github.com" > .npmrc && \
  echo "@vrsoftbr:registry=https://npm.pkg.github.com" >> .npmrc && \
  echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build:app

FROM nginx:alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/app /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]