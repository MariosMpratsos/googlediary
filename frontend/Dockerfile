# --- STAGE 1: Build Vite Frontend ---
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Συνδέουμε το Frontend με την Public IP του AWS και την πόρτα του K3s Backend
ENV VITE_API_URL=http://16.171.139.5:30500
RUN npm run build

# --- STAGE 2: Serve with Nginx ---
FROM nginx:alpine

# Αντιγραφή του custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Αντιγραφή των built αρχείων από το Vite (αν ο φάκελός σου λέγεται build αντί για dist, άλλαξέ το)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
