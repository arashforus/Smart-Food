# Stage 1: Build
FROM node:20-alpine AS builder

# Check if we are in Replit or local and set appropriate environment variables
ENV NODE_ENV=development

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
# This runs script/build.ts which handles esbuild for server and vite for client
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --omit=dev

# Install drizzle-kit globally
RUN npm install -g drizzle-kit

# Copy built assets from builder stage
# dist/ contains both client (dist/public) and server (dist/index.cjs)
COPY --from=builder /app/dist ./dist

# Copy migrations so they can be run in production if needed
COPY --from=builder /app/server/migrations ./server/migrations

# Copy shared folder (needed for schema.ts which drizzle.config.ts depends on)
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
# Note: npm run db:push requires DATABASE_URL to be set at runtime
CMD ["npm", "start"]
