FROM node:23-alpine

WORKDIR /app

# Copy only package files first
COPY analytics_server/package*.json ./

RUN npm install

# Copy the analytics_server code
COPY analytics_server/ .

# Copy the shared prisma folder
COPY prisma ./prisma

# Generate the Prisma client
RUN npx prisma generate --schema=./prisma/schema.prisma

CMD ["npm", "run", "start"]
