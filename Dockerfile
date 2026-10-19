FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
# Αφαιρούμε το --only=production για να εγκατασταθούν όλα τα απαραίτητα modules (όπως το dotenv)
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
