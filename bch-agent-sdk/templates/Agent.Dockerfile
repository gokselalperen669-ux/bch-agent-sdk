FROM node:22-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
# We need to install the SDK locally or from NPM
# For this build, we assume the SDK is a dependency in package.json
RUN npm install

# Copy source
COPY . .

# Build TypeScript if needed
RUN if [ -f "tsconfig.json" ]; then npm run build; fi

# Start the agent
CMD ["npm", "start"]
