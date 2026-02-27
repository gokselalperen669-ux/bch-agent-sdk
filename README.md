# 🛡️ BCH NEXUS: The Global Enforcement Layer for Autonomous AI

[![Status: Production Ready](https://img.shields.io/badge/Status-Production--Ready-00E339?style=flat-square&logo=gitbook&logoColor=white)](https://bch-agent-app.vercel.app/)
[![Network: Bitcoin Cash](https://img.shields.io/badge/Network-Bitcoin--Cash-00E339?style=flat-square&logo=bitcoin-cash&logoColor=white)](https://bitcoincash.org)
[![Documentation: Active](https://img.shields.io/badge/Documentation-Active-blue?style=flat-square)](https://bch-agent-app.vercel.app/docs)

### **Intelligence without enforcement is a liability.**  
BCH Nexus is the industry-first framework that transforms AI agents into **sovereign on-chain entities**. By bridging Large Language Models (LLMs) with **Bitcoin Cash Covenants (CashScript)** and **CashTokens**, Nexus ensures that AI autonomy is both verifiable and strictly bounded by decentralized code.

---

## 💎 The Nexus Rationale: Why Blockchain AI?

Traditional AI agents run on centralized scripts. If the server is compromised, the agent's behavior changes invisibly. Nexus anchors AI in reality through:

1.  **Covenant Enforcement:** Agent budgets and logic are hard-coded into BCH Smart Contracts. No one can move the agent's funds unless the on-chain contract rules (spending limits, pre-authorized destinations) are satisfied.
2.  **Proof-of-State (The Reasoning Registry):** Every "Mental Cycle" of the agent is hashed and etched into a **State-NFT Commitment**. This creates a globally verifiable, immutable audit trail of the agent's logic.
3.  **Global Identity (PKI):** Agents utilize the blockchain as a sovereign Public Key Infrastructure. Every agent is a unique NFT, allowing for decentralized negotiation and interoperability without middle-men.

---

## � System Requirements
- **Node.js**: v22.13.0 or higher (Recommended)
- **Docker**: For running the unified HQ locally.
- **LLM Access**: OpenAI or DeepSeek API Key (Required for autonomous reasoning).

> [!TIP]
> If you are working directly from this repository on Windows, you can also use the shorthand `.\bch.bat` instead of `bch-agent` for quick testing before linking.

---

## �🛠️ Launch Options

### **Option A: The Instant HQ (Cloud or Docker)**
Access the live command center directly at **[https://bch-agent-app.vercel.app/](https://bch-agent-app.vercel.app/)**.  
Alternatively, run the entire ecosystem locally via Docker:
```bash
docker-compose up -d --build
```


### **Option B: The Developer Workflow (CLI)**
Install the SDK to build and manage agents from your terminal.
```bash
cd bch-agent-sdk
npm install && npm run build
npm link    # Installs the 'bch-agent' command globally
```

---

## 📟 The Golden Workflow (Logical Sequence)

Follow these steps in order to take an agent from a concept to an on-chain autonomous entity.

### **Phase 1: Environment & Identity**
1.  **`bch-agent login`**: Securely sync your terminal with the Nexus Portal.
    - **Portal URL:** `https://bch-agent-app.vercel.app/`
2.  **`bch-agent init <project>`**: Scaffold a new managed workspace for your agents.
3.  **`bch-agent wallet setup`**: Generate a BIP39 Treasury for your agent. All keys are **AES-256 encrypted** locally.

### **Phase 2: Forge & Compile**
4.  **`bch-agent agent create <name> --type [defi|nft|social|vault]`**: Generate the on-chain Smart Contract and the AI decision logic.
5.  **`bch-agent compile`**: Transform your `.cash` scripts into executable blockchain artifacts.

### **Phase 3: Settlement & Activation**
6.  **`bch-agent deploy <name>`**: Mint the agent's unique **State-NFT** and deploy the covenant to the network.
7.  **`bch-agent start <name>`**: Launch the 24/7 AI loop. Watch the agent etch **Proof-of-State** hashes on-chain!

---

## 🤖 Specialized Agent Blueprints
Nexus provides 4 pre-engineered agent architectures:
- **DEFI Agent**: Built for liquidity pools and swap arbitrage with hard-coded spending limits.
- **NFT Agent**: Manages digital assets and utilizes NFT commitments for verifiable state transitions.
- **SOCIAL Agent**: Handles on-chain messaging, tipping protocols, and broadcast identity.
- **VAULT Agent**: The gold standard for security; an AI-governed multisig/covenant storage entity.

---

## 🚀 Future Vision: The Agentic Economy

BCH Nexus is evolving into a full-scale decentralized marketplace for digital intelligence:

### **1. AI Agent Tokenization (Bonding Curves)**
We are implementing a bonding curve mechanism that allows agents to be "launched" with native tokens. Communities can fund an agent's operation (API costs, liquidity) by purchasing its governance tokens, creating the first **Community-Owned Autonomous Wealth**.

### **2. NFT Agent Marketplace**
Because every Nexus agent is represented by a unique CashToken NFT, ownership is tradable. Users will be able to buy, sell, or rent **pre-trained autonomous agents** on the Nexus Marketplace, complete with their verifiable on-chain "Proof-of-State" reputation.

---

## �️ Infrastructure Stack
- **Smart Contracts:** CashScript (BCH Native Covenants)
- **Identity:** CashTokens (SLP-v3 Compliant)
- **Intelligence:** LLM Agnostic (OpenAI, Anthropic, DeepSeek, Local Ollama)
- **Dashboard:** React 19, Framer Motion, Shimmer Glassmorphism
- **Persistence:** Supabase (PostgreSQL) + Local JSON Redundancy

---

## 🆘 Troubleshooting & Support

- **Doctor Command**: Run `bch-agent doctor` to verify your environment, network connectivity, and API sync status.
- **Sync Issues**: Ensure your portal URL starts with `https://` (for live) or `http://` (for local) during login.
- **Contract Errors**: Use the **Contract Base** tab in the Web Portal to verify your CashScript schemas.

*Developed with ❤️ for the Bitcoin Cash Vanguard.*
*Powered by the Nexus Core Protocol.*
