# 🦾 @bch-agent/sdk: The Engine of Autonomy

The **BCH Agent SDK** is a professional-grade development kit for building verifiable autonomous agents. It provides the CLI, smart contract templates, and the internal `Proof-of-State` engine required to run agents that are governed by the Bitcoin Cash network.

---

## 🛠 Installation

```bash
# From the bch-agent-sdk directory:
npm install
npm run build
npm link
```
*Verify installation with:* `bch-agent doctor`

---

## 🧭 CLI Command Walkthrough

### 1. `bch-agent login`
Syncs the CLI with your Nexus Portal. Supports local development (`http://localhost:4000`) and live production URLs.
- **Saves:** Identity token and API endpoint to `~/.bch-agent/auth.json`.

### 2. `bch-agent init <name>`
Scaffolds a new project directory.
- **Includes:** `agent.config.json` for AI settings and a `/contracts` folder.

### 3. `bch-agent wallet setup`
Creates or recovers a BIP39 mnemonic. 
- **Security:** Mnemonics are **AES-256 encrypted** using a local password. They never leave the `.vault/` directory.

### 4. `bch-agent agent create <name> --type <type>`
Generates two files for your agent:
1.  **`contracts/<name>.cash`**: The on-chain governance covenant.
2.  **`agents/<name>.ts`**: The AI reasoning and execution loop.
- **Types:** `defi`, `nft`, `social`, `vault`.

### 5. `bch-agent compile`
Uses the internal CashScript compiler to transform your `.cash` templates into executable artifacts (`.json`).

### 6. `bch-agent deploy <name>`
**The Critical Step:**
- Deploys the contract to the blockchain.
- Mints a unique **State NFT** representing the agent's identity.
- Syncs the agent metadata with your Dashboard.

### 7. `bch-agent start <name>`
Launches the autonomous thinking cycle. Every decided action will be:
1.  Verified against the on-chain covenant.
2.  Hashed and etched into the State NFT as a `Proof-of-State`.
3.  Recorded in the Dashboard logs.

---

## 🔬 Advanced: Proof-of-State Architecture

Nexus agents aren't just bots; they are verifiable entities.

### **The Reasoning Loop:**
1.  **Analyze:** Agent reads on-chain balance and external API triggers.
2.  **Reason:** LLM (OpenAI/DeepSeek) decides on the next financial move.
3.  **Hash:** A SHA-256 hash of the *Reasoning + Timestamp* is generated.
4.  **Etch:** The transaction is broadcast to the BCH network. The `NFT Commitment` area is updated with the hash.
5.  **Verify:** Anyone can look at the blockchain history to see exactly *when* and *with what intent* a transaction was made.

---

## 📁 Directory Structure

```text
/agents       - User-defined agent logic (TypeScript)
/contracts    - CashScript covenants (.cash + .json)
/dist         - Compiled SDK source
/src/core     - Internal Proof-of-State & AI Engine
/src/cli      - CLI command definitions
.vault/       - Local encrypted wallet storage
```

---

## 🛡 Security Policy
- **Keys:** Private keys are handled exclusively in memory during the reasoning loop. Default storage is PBKDF2-derived AES-256.
- **Protocol:** Any fund movement over the predefined contract limit (default 0.005 BCH for autonomous actions) is rejected **by the blockchain**, not the software.

*Built for the Vanguard of Bitcoin Cash.*
