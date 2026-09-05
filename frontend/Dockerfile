FROM node:18-alpine

WORKDIR /app

# Install frontend dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source code
COPY . .

EXPOSE 5173

# Run Vite dev server with host exposure for Docker
CMD ["npm", "run", "dev", "--", "--host"]
