# Gunakan Node.js versi LTS ringan
FROM node:18-alpine

# Buat direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json (agar caching efisien)
COPY package*.json ./

# Install semua dependencies (termasuk devDependencies)
RUN npm install

# Install netcat untuk menunggu MySQL siap
RUN apk add --no-cache netcat-openbsd

COPY . .

EXPOSE 4000

# Jalankan script wait-for-db sebelum node server.js
CMD ["sh", "wait-for-db.sh", "mysql", "npm", "run", "dev"]