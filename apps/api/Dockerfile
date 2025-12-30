# Build stage
FROM node:22 AS build

WORKDIR /app

# Copy everything (workspaces need all package.json files)
COPY . .

# Install dependencies
RUN npm install --legacy-peer-deps

# Build frontend and API
RUN npx nx build @org/frontend
RUN npx nx build @org/api

# Production stage
FROM ubuntu:24.04

# Avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js 22, FFmpeg, and curl (for healthcheck)
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ffmpeg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && ffmpeg -version && node --version

WORKDIR /app

# Copy built artifacts (everything is bundled into main.js)
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/frontend/dist ./apps/frontend/dist

# Create encoder-output directories (will be overwritten by volume mount)
RUN mkdir -p /encoder-output/converted-files/temp \
    /encoder-output/pending-conversion-files \
    /encoder-output/logs

# Expose port
EXPOSE 3333

# Set environment defaults
ENV NODE_ENV=production
ENV PORT=3333

# Start the API
CMD ["node", "apps/api/dist/main.js"]
