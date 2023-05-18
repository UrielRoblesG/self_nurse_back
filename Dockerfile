FROM node:20-alpine3.16 as deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

FROM node:20-alpine3.16 as builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . . 
RUN npm run build

FROM node:20-alpine3.16 as runner
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist

CMD [ "node" "/dist/main" ]

