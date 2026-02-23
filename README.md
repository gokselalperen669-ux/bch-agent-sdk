# 🛡️ BCH NEXUS: The Global HQ for Autonomous AI Agents

[![Status: Production Ready](https://img.shields.io/badge/Status-Production--Ready-00E339?style=flat-square&logo=gitbook&logoColor=white)](https://bch-agent-app.vercel.app/)
[![Network: Bitcoin Cash](https://img.shields.io/badge/Network-Bitcoin--Cash-00E339?style=flat-square&logo=bitcoin-cash&logoColor=white)](https://bitcoincash.org)
[![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)](https://github.com/vanguard-bch/nexus)

### **Empowering the next generation of on-chain intelligence.**  
BCH Nexus is the ultimate framework for building, deploying, and managing **autonomous AI agents** on the Bitcoin Cash blockchain. Leveraging CashScript smart contracts and high-performance LLMs, Nexus allows you to tokenize intelligence and run 24/7 on-chain entities with full financial autonomy.

---

## 🌌 The Vision
We believe AI should not just think, but **act**. Nexus provides the bridge between large language models and the decentralized economy. Whether it's a DeFi liquidity manager, an NFT-based state commitment engine, or a social broadcast agent—Nexus is the backbone of the agentic revolution.

---

## 🛠️ Core Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Smart Contracts** | CashScript (BCH Native) |
| **Governance** | CashTokens (SLP-v3 / BCMR) |
| **Intelligence** | OpenAI, Anthropic, DeepSeek, Ollama |
| **Backend** | Node.js, Express, Supabase (PostgreSQL) |
| **Frontend** | React 19, Vite, Framer Motion, Lucide |
| **Infrastructure** | Docker, Vercel, Railway, Github Actions |

---

## 🚀 Quick Start (Production Setup)

**Live Dashboard:** [https://bch-agent-app.vercel.app/](https://bch-agent-app.vercel.app/)

### 1. Requirements
- **Docker & Docker Compose** (Recommended for stability)
- **Node.js 22+** (For local development)
- **OpenAI/DeepSeek API Key** (For agent intelligence)

### 2. Launch the HQ (Docker)
Run the entire ecosystem (Frontend + Unified API) with a single command:
```bash
docker-compose up -d --build
```
This will start:
- 🌐 **Frontend + API Hub** on `http://localhost:4000`
- 🛡️ **Nexus Relay Service** for sync status.

### 3. Initialize your first Agent Project
```powershell
# Install the SDK globally (if published) or use the local script
.\bch.bat init my-first-agent
cd my-first-agent
npm install
```

---

## 📟 CLI Command Matrix

The **BCH Nexus CLI** is your command center for agent operations.

| Command | Action | Description |
| :--- | :--- | :--- |
| `login` | `bch login` | Securely authenticate your CLI with the Global HQ. |
| `init` | `bch init [name]` | Scaffold a new agent project with templates. |
| `wallet setup` | `bch wallet setup` | Interactive HD wallet creation (Testnet/Mainnet). |
| `compile` | `bch compile` | Transform `.cash` scripts into usable JSON artifacts. |
| `agent create` | `bch agent create` | Generate advanced AI logic tied to a smart contract. |
| `doctor` | `bch doctor` | Full system health check (Sync, Node, API, Network). |
| `token tokenize` | `bch token tokenize` | Issue native CashTokens for your agent's governance. |

---

## 🏢 Infrastructure Map

### **Unified API Serverless Hub**
Our backend is located in `bch-agent-app/api-server.js`. It is optimized for Vercel Serverless but also supports local Node.js environments.
- **Authentication:** JWT with Bcrypt hashing.
- **Persistence:** Supabase (Cloud) or Mock JSON (Local).
- **Communication:** REST API for CLI sync and Dashboard access.

### **Environment Configuration**
To connect your ecosystem, ensure these variables are set in your deployment platform:
- `VITE_API_URL`: Points to your deployed domain.
- `JWT_SECRET`: Secure token for session management.
- `SUPABASE_URL`: Your database endpoint.
- `SUPABASE_KEY`: Your database service role key.

---

## 🛡️ Security First
Nexus is built with security as a core tenet:
- **Vault Encryption:** Mnemonics are AES-256 encrypted in the `.vault` folder.
- **Rate Limiting:** API endpoints are protected against brute-force attacks.
- **Isolated Execution:** Each agent runs in its own logic container.

---

## 🤝 Community & Ecosystem
Join the vanguard of BCH development. Build agents that don't just solve problems—they **solve them on-chain.**

**Developed with ❤️ by the Nexus Core Team.**
*Powered by Bitcoin Cash.*
