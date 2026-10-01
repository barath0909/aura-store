# Stage 1: Build React/Vite application
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency configs
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all frontend source files and build
COPY . .
RUN npm run build

# Stage 2: Serve static files using Nginx
FROM nginx:alpine

# Copy built frontend assets from stage 1 to nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]