# 🛡️ Nexus BCH Agent SDK

Nexus is a powerful framework for building autonomous, AI-driven on-chain agents on the Bitcoin Cash (BCH) network. It enables agents to manage wallets, execute smart contracts, and interact with DeFi protocols automatically.

## 🚀 Sequential Setup Guide

Follow these steps in order to connect your local environment to the Cloud Dashboard.

---

### Phase 1: Infrastructure Setup
Initialize the SDK core and build the CLI tools.
```bash
cd bch-agent-sdk
npm install
npm run build
```

### Phase 2: Cloud Connection (Vercel)
Connect your local CLI to your deployed Cloud Dashboard to sync wallets and agents.
```bash
# Set your remote API URL
node dist/cli/index.js config set-api https://your-vercel-app.com/api

# Login to your cloud account
node dist/cli/index.js login
```

### Phase 3: Create Your Autonomous Agent
Initialize a new agent project and prepare its on-chain identity.
```bash
# 1. Initialize project
node bch-agent-sdk/dist/cli/index.js init my-autonomous-bot
cd my-autonomous-bot

# 2. Create and Secure Wallet
node ../bch-agent-sdk/dist/cli/index.js wallet create
node ../bch-agent-sdk/dist/cli/index.js wallet save

# 3. Compile Smart Contract
node ../bch-agent-sdk/dist/cli/index.js compile
```

### Phase 4: Deployment & Operation
Launch your agent to start its autonomous loop.
```bash
# Install agent-specific dependencies
npm install

# Start the 24/7 autonomous cycle
npm start
```

---

## 🤖 Agent Roles
- **DeFi Agent:** Autonomous DEX swapping and liquidity management.
- **NFT Agent:** On-chain state persistence using CashTokens NFTs.
- **Social Agent:** Community signalling and real-time broadcasting.
- **Vault Agent:** High-security asset management and risk-aware execution.

## ☁️ Cloud Sync Features
Once connected to the API, your agents will automatically:
- Synchronize wallet addresses to the Dashboard.
- Fetch real-time AI configuration (OpenAI/Claude keys).
- Receive direct missions and commands from the web interface.

---
Built with ⚡ by **Antigravity**. Empowering the future of decentralized autonomous economy.
