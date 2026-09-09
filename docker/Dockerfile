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

# The official image ships every optional module (acme, geoip, image-filter, njs,
# xslt) and curl for debugging. This config loads none of them — the server block
# below uses no module directive — and their dependency trees are the whole fixable
# High surface of this image: image-filter drags in libgd and with it tiff, whose
# Highs (CVE-2023-52356, CVE-2026-4775) no Alpine build fixes yet, and curl drags
# in libcurl and nghttp2-libs. Delete the modules and curl so those packages never
# ship; `apk upgrade` first still picks up every fixable package the base lags on.
RUN apk upgrade --no-cache \
 && apk del nginx-module-acme nginx-module-geoip nginx-module-image-filter \
          nginx-module-njs nginx-module-xslt curl

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
