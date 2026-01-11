# name=Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
# copy lock and package to ensure deterministic installs
COPY package.json package-lock.json ./
# install all deps (dev + prod) for build
RUN npm ci
COPY . .
RUN npm run build

# production image
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
# install only production dependencies
RUN npm ci --production
# copy built output
COPY --from=builder /app/dist ./dist
# copy uploads folder (will be overridden by mounted volume in production)
COPY --from=builder /app/uploads ./uploads
# COPY migration folder so migration files are available in production image.
# Adjust the source path (/app/migrations) if your project stores migrations elsewhere.
COPY --from=builder /app/migrations ./migrations
# Optional: copy an entrypoint script that runs migrations before starting the app.
# See entrypoint.sh below. If you don't want the image to attempt to run migrations
# automatically, remove these two lines and keep the original CMD.
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "dist/index.cjs"]
