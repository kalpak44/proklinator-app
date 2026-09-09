FROM node:24-alpine AS web-builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY src ./src
COPY public ./public
COPY index.html vite.config.js ./

# The package script, not `npx vite build`, so the image cannot build with different
# arguments from the ones CI verified.
RUN npm run build

FROM nginx:1.31-alpine

# Fixed upstream but not yet in the base: libuuid alone accounts for every fixable
# High finding this image reports.
RUN apk upgrade --no-cache

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=web-builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# A malformed server block would otherwise only fail when the pod starts, which reads
# as CrashLoopBackOff rather than as a bad config.
RUN nginx -t

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
