# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
# We also include drizzle-kit here because it's needed for the migration
RUN npm install --omit=dev && npm install drizzle-kit

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy migrations and shared folder (needed for schema)
COPY --from=builder /app/server/migrations ./server/migrations
COPY --from=builder /app/shared ./shared

# Copy drizzle configuration
COPY --from=builder /app/drizzle.config.ts ./

# Create uploads directory
RUN mkdir -p uploads

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the application port
EXPOSE 5000

# Use the start script which handles migrations and starting the server
CMD ["npm", "start"]
