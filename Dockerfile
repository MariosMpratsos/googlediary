FROM node:18-alpine

WORKDIR /app

# Εγκατάσταση dependencies (μόνο production για μικρότερο μέγεθος)
COPY package*.json ./
RUN npm install

# Αντιγραφή κώδικα backend
COPY . .

# Σιγουρέψου ότι το server.js ακούει στο port 5000 (π.χ. process.env.PORT || 5000)
ENV PORT=5000
EXPOSE 5000

CMD ["node", "server.js"]
