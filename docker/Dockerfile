FROM node:24-slim AS web-builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY src ./src
COPY public ./public
COPY index.html vite.config.js eslint.config.js ./

RUN npx vite build

FROM nginx:1.31-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=web-builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1