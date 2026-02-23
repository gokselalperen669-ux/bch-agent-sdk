<p align="center">
  <img src="https://raw.githubusercontent.com/gokselalperen669-ux/bch-agent-sdk/main/bch-agent-sdk/assets/logo.png" width="300" alt="BCH Agent Framework Logo">
</p>

# Nexus: The Ultimate BCH Autonomous Agent Engine

**Nexus** is a professional-grade SDK and CLI ecosystem designed for building, deploying, and managing autonomous AI agents on the Bitcoin Cash (BCH) network. These agents can think, reason, and execute on-chain transactions autonomously using high-level LLMs and CashScript smart contracts.

---

## � Quick Start Guide (Localhost First)

Nexus is designed to run perfectly on your local machine. Follow these steps to launch your autonomous agent command center.

### 1. Prerequisites
- **Node.js 20+**
- **Git**
- **PowerShell / Terminal**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/gokselalperen669-ux/bch-agent-sdk.git
cd bch-agent-sdk

# Install dependencies and link the CLI
cd bch-agent-sdk
npm install
npm run build
npm link
```

### 3. Launching the Nexus HQ (Backend & Dashboard)
Open **two separate terminals** to start the core services:

**Terminal 1 (API Server):**
```bash
cd bch-agent-app
npm run api
```

**Terminal 2 (Web Dashboard):**
```bash
cd bch-agent-app
npm run dev
```
*Visit `http://localhost:5173` in your browser to create your account.*

---

## 🛠️ Developer Workflow: Creating Your First Agent

Once your HQ is running, open a **third terminal** to manage your agents using the CLI.

### Step 1: Authentication
Login with the account you created on the Web Dashboard:
```bash
bch-agent login
```

### Step 2: Initialize Your Project
```bash
# Create and enter your project workspace
bch-agent init my-agent-project
cd my-agent-project
```

### Step 3: Secure Wallet Setup
Configure your agent's treasury.
```bash
bch-agent wallet setup
# Follow the prompts to create a new encrypted mnemonic (Testnet4).
```

### Step 4: Forge the Agent
Create a specialized agent (DeFi, Social, NFT, or Vault).
```bash
bch-agent agent create AgentX --type defi
```

### Step 5: Compile & Deploy
Transform your agent's logic into blockchain bytecode and sync it with the Dashboard.
```bash
# Compile the Smart Contracts
bch-agent compile

# Deploy to the Blockchain (Testnet4)
bch-agent deploy AgentX --network testnet4
```

### Step 6: Activate Autonomous Intelligence
Launch the AI thinking loop. Your agent will now start making independent decisions!
```bash
bch-agent agent run AgentX
```

---

## � Features & Roadmap

### 🛡️ Phase 1: Autonomous Core (COMPLETED)
- **Neural Reasoning Loop:** Deep analysis and on-chain action execution.
- **Local Message Bus:** Inter-agent communication (Crosstalk protocol).
- **Persistent Memory:** Local storage for past decisions and context.
- **Intelligence Hub:** Dashboard interface to manage OpenAI, Telegram, and DeFi API keys.
- **Advanced CLI:** Full lifecycle management from `init` to `run`.

### 🌐 Phase 2: Ecosystem expansion (UPCOMING)
- **NFT Identity Marketplace:** Tradable ownership of autonomous agents.
- **Bonding Curve Tokenization:** Community funding for agent operations.

---

## 🔒 Security & Privacy
- **Local Keys:** Your private keys and mnemonics **never** leave your local machine or vault.
- **Encrypted Sync:** Agent reasoning and logs are synced to the dashboard via secure `authToken`.
- **Open Source:** Full transparency in smart contracts and SDK logic.

---

## 🌍 Global Deployment
Want to run your agents 7/24 in the cloud? Nexus is production-ready.
- **Backend/API:** Support for Docker, Render, and Railway (`Procfile` included).
- **Frontend:** Optimized for Vercel and Netlify.

Built with 💚 for the Bitcoin Cash ecosystem.
