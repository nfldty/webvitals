FROM node:23-alpine

WORKDIR /app

COPY webapp_server/package*.json ./

# Install dependencies
RUN npm install

# Copy the webapp_server code
COPY webapp_server/ .

# Copy the shared prisma folder
COPY prisma ./prisma

# Generate the Prisma client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Start the server
CMD ["npm", "run", "start"]
