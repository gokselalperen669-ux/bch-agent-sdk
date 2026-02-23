# 🛡️ Nexus: The Global BCH Autonomous Agent Engine

**Enterprise-Grade SDK for Building, Deploying, and Scaling AI Agents on Bitcoin Cash.**

Nexus is the ultimate framework for the decentralized autonomous economy. It combines high-performance BCH smart contracts (CashTokens) with advanced LLM reasoning to create agents that can think, transact, and evolve independently.

---

## 🌟 Key Features

- **Autonomous reasoning loop:** Integrated memory and state-aware decision making using GPT-4, Claude 3, and DeepSeek.
- **Proof-of-State (PoS):** Agents commit their mental state to the blockchain using CashTokens NFT metadata.
- **Liquidity Bonding:** Tokenize your agents and launch them on the integrated DEX.
- **Production-Ready:** Full Docker support for 7/24 operation on VPS, Railway, or AWS.
- **Multi-Agent Orchestration:** Manage an entire fleet of bots from a single unified Dashboard.

---

## 🚀 Quick Start (Production Setup)

Nexus is designed to be deployed instantly using Docker Compose or dedicated cloud platforms like Vercel and Railway.

**Live Dashboard:** [https://bch-agent-app.vercel.app/](https://bch-agent-app.vercel.app/)

### 1. Requirements
- Docker & Docker Compose
- Node.js 22+ (for local development)
- OpenAI or DeepSeek API Key

### 2. Environment Variables
To connect your ecosystem, set the following variables:

#### Frontend (Vercel)
- `VITE_API_URL`: Your API backend URL (e.g., `https://nexus-api.railway.app`)
- `VITE_SUPABASE_URL`: (Optional) If using direct Supabase
- `VITE_SUPABASE_ANON_KEY`: (Optional)

#### Backend (API)
- `JWT_SECRET`: A long random string
- `SUPABASE_URL`: Your Supabase Project URL
- `SUPABASE_KEY`: Your Supabase Service Role Key
- `PORT`: 4000 (default)

#### CLI
- `AGENT_API_URL`: Points to your Backend API

### 3. Launching Locally
```bash
# Clone the repository
git clone https://github.com/vanguard-bch/nexus-framework.git
cd nexus-framework

# Launch the Full Stack (API + App)
docker-compose up -d --build
```
Your dashboard will be available at `http://localhost`.

---

## 🛠️ Developer Workflow

### Core SDK Setup
```bash
cd bch-agent-sdk
npm install
npm run build
```

### Initializing an Agent
```bash
# Create a root link to the CLI
./bch.bat init my-autonomous-fund
cd my-autonomous-fund

# Generate keys and compile agent logic
../bch.bat wallet create
../bch.bat compile
```

### Running 7/24
```bash
# Each agent comes with its own Dockerfile
docker build -t my-agent .
docker run -d --name nexus-agent-1 my-agent
```

---

## 🤖 AI Logic & Memory
Nexus agents don't just react; they **remember**. 
The updated `AiEngine` includes a rolling memory window that allows agents to learn from past transactions and reasoning cycles, ensuring strategic consistency over time.

---

## 🌍 Ecosystem
- **Nexus API:** Secure relay for agent-to-dashboard communication.
- **Nexus Studio:** Visual lab for designing agent behaviors and triggers.
- **Token Exchange:** High-liquidity marketplace for tokenized autonomous entities.

---

Built with ⚡ by **Antigravity**. 
*Empowering the sovereign autonomous future on Bitcoin Cash.*
