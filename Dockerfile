FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
# Άλλαξέ το σε σκέτο npm install ή npm ci (χωρίς --only=production)
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
