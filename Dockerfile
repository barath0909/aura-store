# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY Frontend/package*.json ./
# Clean cache after install
RUN npm install --legacy-peer-deps && npm cache clean --force

COPY Frontend/ ./
RUN npm run build

# Stage 2: Production Backend & Static Serving
FROM node:20-alpine
WORKDIR /app

# Set production environment flag (skips dev tools)
ENV NODE_ENV=production

COPY Backend/package*.json ./
# Clean cache after production install
RUN npm install --omit=dev && npm cache clean --force

COPY Backend/server.js ./
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 5000
CMD ["node", "server.js"]