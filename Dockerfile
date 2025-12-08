FROM node:25.2.1-alpine AS base
WORKDIR /app

RUN npm install -g npm@9.8.0;

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --prefer-offline --no-audit;

# 以降にsrcなど本体COPY/ build/ RUN追加
