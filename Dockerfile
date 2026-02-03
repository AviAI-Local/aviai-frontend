# Use Node.js 18 as base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY client/package*.json .

# Install dependencies
RUN npm ci

# Copy source code
COPY client/. . 

# Build the application (skip TypeScript checking)
RUN npx vite build --mode production

# Install serve to run the built application
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"] 