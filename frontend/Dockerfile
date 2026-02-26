# Stage 1 — Build
FROM node:25-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2 — Production
FROM node:25-slim

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

CMD ["sh", "-c", "serve -s dist -l ${FRONTEND_CONTAINER_PORT}"]
