# Multi-stage Dockerfile for Admin Dashboard (Vite SPA + Nginx)
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Build-time environment arguments
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_BASE_URL
ARG VITE_STOREFRONT_URL

ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_STOREFRONT_URL=$VITE_STOREFRONT_URL

RUN bun run build

# Production Nginx image
FROM nginx:1.25-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
