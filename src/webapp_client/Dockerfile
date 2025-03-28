# Stage 1
FROM node:23-alpine AS react-builder
WORKDIR /app

# Copy package files and install dependencies
COPY dashboard/package*.json ./
RUN npm install

# Copy the rest of the source code and build the app
COPY dashboard .
RUN npm run build


# Stage 2
FROM node:23-alpine AS widget-builder
WORKDIR /widget
COPY widget/package*.json ./
RUN npm install
COPY widget .
RUN npm run build

# Stage 3
FROM nginx:stable-alpine

COPY --from=react-builder /app/build /usr/share/nginx/html/app

COPY --from=widget-builder /widget/widget.js /usr/share/nginx/html/widget/widget.js

COPY nginx.conf /etc/nginx/nginx.conf
