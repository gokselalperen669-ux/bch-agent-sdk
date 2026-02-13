FROM node:20-slim

WORKDIR /app

# Copy package files from the app directory
COPY bch-agent-app/package.json bch-agent-app/package-lock.json* ./

# Install only production dependencies
RUN npm install --production

# Copy server logic and database
COPY bch-agent-app/api-server.js ./
COPY bch-agent-app/db.json ./

# Expose the API port
EXPOSE 4000

# Set production environment defaults
ENV NODE_ENV=production
ENV PORT=4000

# Create data directory for persistent storage (Railway Volumes)
RUN mkdir -p /data

# Run the Nexus HQ API
CMD ["node", "api-server.js"]
