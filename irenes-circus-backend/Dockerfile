# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && cp -R node_modules /tmp/prod_node_modules

# Install dev dependencies for building
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Final image
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy production node_modules and built files
COPY --from=base /tmp/prod_node_modules ./node_modules
COPY package*.json ./
COPY --from=base /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/index.js"] 