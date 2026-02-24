FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN if [ -f "tsconfig.json" ]; then npx tsc; fi
# Use global or local bch-agent for production loop
CMD ["npx", "bch-agent", "start", "test1"]