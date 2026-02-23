# 🛡️ BCH Nexus Global HQ - Production Environment
FROM node:22-slim AS builder

WORKDIR /app

# Copy root configurations
COPY package*.json ./
COPY .gitignore ./

# Copy App and SDK
COPY bch-agent-app/package*.json ./bch-agent-app/
COPY bch-agent-sdk/package*.json ./bch-agent-sdk/

# Install dependencies
RUN npm install
RUN cd bch-agent-app && npm install
RUN cd bch-agent-sdk && npm install

# Copy source
COPY . .

# Build Frontend
RUN cd bch-agent-app && npm run build

# --- Runtime Stage ---
FROM node:22-slim

WORKDIR /app

# Copy built assets and necessary files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/bch-agent-app ./bch-agent-app
COPY --from=builder /app/bch-agent-sdk ./bch-agent-sdk

# Default Command: Start the consolidated API/Frontend server
ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]
