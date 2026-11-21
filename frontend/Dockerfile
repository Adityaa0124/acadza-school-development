FROM node:18-alpine

# NEXT_PUBLIC_* values are baked into the client bundle at BUILD time.
# Pass it as a build arg (see docker-compose.yml) so it can be changed
# without editing source. The default matches local development.
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
