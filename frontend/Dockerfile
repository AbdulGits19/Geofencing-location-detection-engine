FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# --host exposes Vite outside the Docker container so your browser can reach it
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]