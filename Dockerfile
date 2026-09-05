FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm install

# Copy backend source code (including server.js)
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
