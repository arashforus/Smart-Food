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
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "dist/index.cjs"]
