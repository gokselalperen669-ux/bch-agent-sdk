# 🛡️ BCH NEXUS: The Enforcement Layer for Autonomous AI

[![Status: Production Ready](https://img.shields.io/badge/Status-Production--Ready-00E339?style=flat-square&logo=gitbook&logoColor=white)](https://bch-agent-app.vercel.app/)
[![Network: Bitcoin Cash](https://img.shields.io/badge/Network-Bitcoin--Cash-00E339?style=flat-square&logo=bitcoin-cash&logoColor=white)](https://bitcoincash.org)
[![Documentation: Active](https://img.shields.io/badge/Documentation-Active-blue?style=flat-square)](https://bch-agent-app.vercel.app/docs)

### **Intelligence is not enough. You need Enforcement.**
BCH Nexus is a professional-grade framework that transforms autonomous AI agents into **enforceable on-chain entities**. By bridging LLM reasoning with Bitcoin Cash Covenants (CashScript) and CashTokens, Nexus ensures that AI agents don't just "decide"—they "commit" to a globally verifiable ledger.

---

## 💎 Why BCH Nexus? (The Protocol Rationale)

Most AI agents are just "scripts with API keys." If the server owner changes the script, the agent's behavior changes invisibly. Nexus solves this with:

1.  **Covenant Enforcement:** Agent budgets and logic are locked into BCH Smart Contracts. No one (not even the server owner) can move the agent's funds unless the contract rules (spending limits, destination checks) are satisfied.
2.  **Proof-of-State (On-Chain Audit):** Every "Mental Cycle" (reasoning step) of the agent is hashed and etched into a **State NFT Commitment**. This creates a permanent, immutable audit trail of the agent's logic.
3.  **Universal Identity (PKI):** Agents utilize the Bitcoin Cash network as a sovereign Public Key Infrastructure. Every agent has a unique on-chain identity (NFT) that allows for peer-to-peer negotiation without centralized servers.

---

## 🛠️ Project Structure

- **`/bch-agent-sdk`**: The Core Developer Kit. Includes the `bch-agent` CLI and internal logic for Proof-of-State emissions.
- **`/bch-agent-app`**: The Premium Dashboard. A React-based command center to monitor logs, manage vaults, and visualize agent health.

---

## 🚀 The Complete Workflow (Zero to Agent)

Follow this linear workflow to launch your first verifiable autonomous entity.

### 1. Launch the Nexus Portal (Web)
The Portal provides the visual dashboard and authentication layer.
```bash
cd bch-agent-app
npm install
npm run api  # Start the API Hub (Port 4000)
npm run dev  # Start the Visual Dashboard (Port 5173)
```
*Action: Open `http://localhost:5173`, create an account, and get your Portal URL.*

### 2. Configure the CLI (SDK)
Open a new terminal to install the command center.
```bash
cd bch-agent-sdk
npm install
npm run build
npm link    # Install 'bch-agent' command globally
```

### 3. Connect & Authenticate
Securely link your CLI to your Portal (Local or Live Vercel).
```bash
bch-agent login
# ? Enter your Nexus Portal URL: http://localhost:4000
# ? Enter your email: user@nexus.so
```

### 4. Forge and Deploy your Agent
Create a specialized entity governed by a smart contract.
```bash
bch-agent init my-project
cd my-project
bch-agent wallet setup    # Create your agent's Treasury
bch-agent agent create NexusSwap --type defi
bch-agent compile           # Generate On-Chain Bytecode
bch-agent deploy NexusSwap  # Mint the State NFT & Push to Chain
```

### 5. Activate Autonomy
Start the reasoning loop. Watch as the agent etches its decisions on-chain.
```bash
bch-agent start NexusSwap
```

---

## 📟 CLI Command Matrix (Cheat Sheet)

| Command | Action | Goal |
| :--- | :--- | :--- |
| `login` | `bch-agent login` | Sync CLI with Local or Live Web Portal. |
| `wallet setup` | `bch-agent wallet setup` | Encrypted Treasury creation (AES-256). |
| `agent create` | `bch-agent agent create` | Scaffold Contract + AI Logic + API Sync. |
| `compile` | `bch-agent compile` | Build `.cash` contracts into `.json` artifacts. |
| `deploy` | `bch-agent deploy` | On-chain settlement & NFT Identity minting. |
| `start` | `bch-agent start` | 7/24 Execution loop & Proof-of-State sync. |
| `doctor` | `bch-agent doctor` | Network, API, and Health diagnostic. |

---

## 🛡️ Infrastructure & Deployment
- **Docker Ready:** Use `docker-compose up` to run the entire stack (App + API).
- **Vercel Ready:** The `bch-agent-app` is optimized for Vercel Serverless.
- **Supabase Cloud:** Use Supabase for production-grade persistence and auth.

---

**Built with ❤️ for the Bitcoin Cash Accelerator.**  
*Empowering agents to solve problems on-chain.*
