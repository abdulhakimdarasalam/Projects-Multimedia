# Dockerfile

# 1. Base Image: Gunakan image resmi Node.js versi 18 yang ringan (alpine)
FROM node:18-alpine

# 2. Set Working Directory: Buat dan tentukan folder kerja di dalam container
WORKDIR /app

# 3. Copy package files: Salin package.json dan package-lock.json terlebih dahulu
# Ini memanfaatkan cache Docker. Jika file-file ini tidak berubah, Docker tidak akan menginstal ulang dependensi.
COPY package*.json ./

# 4. Install Dependencies: Jalankan npm install di dalam container
RUN npm install

# 5. Copy aplication code: Salin semua file proyek lainnya ke dalam container
COPY . .

# 6. Expose Port: Beri tahu Docker bahwa container akan berjalan di port 3000
EXPOSE 3000

# 7. Command to Run: Perintah default untuk menjalankan aplikasi saat container dimulai
CMD ["npm", "run", "dev"]