FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN npx prisma generate

RUN mkdir -p data

EXPOSE 3009

CMD ["sh", "-c", "npx prisma db push --skip-generate && node src/index.js"]
