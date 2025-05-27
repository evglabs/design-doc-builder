# Multi-stage build for Design Document Builder
# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN npm run build

# Stage 3: Production runtime dependencies
FROM node:18-alpine AS production-deps

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Stage 4: Production image
FROM node:18-alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create app directory
WORKDIR /app

# Copy production dependencies
COPY --from=production-deps /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package*.json ./

# Copy backend build
COPY --from=backend-builder /app/backend/dist ./dist

# Copy SQL schema file (not included in TypeScript build)
COPY --from=backend-builder /app/backend/src/database/schema.sql ./dist/database/

# Copy frontend build to serve statically
COPY --from=frontend-builder /app/frontend/dist ./public

# Create necessary directories
RUN mkdir -p ./database ./uploads ./backups

# Copy environment example
COPY .env.example ./.env.example

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]
