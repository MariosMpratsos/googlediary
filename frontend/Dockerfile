# Stage 1: Build Vite App
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Nginx με HTTPS (SSL/TLS)
FROM nginx:alpine

# Δημιουργία SSL Certificate για την IP 16.171.139.5 & Fix Permissions
RUN apk add --no-cache openssl && \
    mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/selfsigned.key \
    -out /etc/nginx/ssl/selfsigned.crt \
    -subj "/C=GR/ST=Attica/L=Athens/O=DevOps/CN=16.171.139.5" \
    -addext "subjectAltName=IP:16.171.139.5" && \
    chmod 600 /etc/nginx/ssl/selfsigned.key && \
    chmod 644 /etc/nginx/ssl/selfsigned.crt

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
