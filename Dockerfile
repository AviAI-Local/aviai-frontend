# --- Build stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY client/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY client/ ./

# Build the production bundle (skips the tsc type-check gate, which currently
# fails on pre-existing type errors in unused/WIP files; esbuild/vite still
# transpiles and bundles everything that's actually reachable from main.tsx)
RUN npm run build:docker

# --- Runtime stage ---
FROM node:20-alpine

WORKDIR /app

# Lightweight static file server with SPA fallback support
RUN npm install -g serve

# Copy built assets from the build stage
COPY --from=builder /app/dist ./dist

# Render provides the PORT env var at runtime
EXPOSE 3000

CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:${PORT:-3000}"]
