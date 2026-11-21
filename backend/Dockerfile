FROM node:18-alpine

WORKDIR /app

# Install dependencies first so the layer is cached when only source changes.
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 4000

# app.js reads PORT (default 4000) and all secrets from the environment,
# which docker-compose supplies. No .env file is needed inside the image.
CMD ["node", "app.js"]
