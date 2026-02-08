---
description: Advanced Agent Production & Tokenization Workflow
---

# 🚀 Advanced Agent Production & Tokenization Workflow

This workflow describes the process of creating AI Agents via the CLI, synchronizing them with the Web Interface, and managing their tokenization and marketplace activities.

## 1. Agent Production (CLI)
// turbo
1. Initialize or select a project:
   ```bash
   bch-agent init <project-name>
   ```
2. Create a new agent with a specific persona:
   ```bash
   bch-agent agent create <AgentName> --type <defi|social|nft|vault>
   ```
3. Compile the agent's smart contracts:
   ```bash
   bch-agent compile
   ```
4. Deploy the agent to the Bitcoin Cash network:
   ```bash
   bch-agent deploy <AgentName> --network <testnet4|mainnet>
   ```

## 2. Web Interface Synchronization
The agent is automatically registered to the web dashboard upon deployment if logged in.
1. Verify the agent appears in the **Agent Lab** (http://localhost:5173/lab).
2. Monitor real-time logs and state transitions via the web UI.

## 3. Wallet Tokenization (Agent Coin)
If requested, the agent's wallet and identity can be tokenized into fungible "Agent Coins".
// turbo
1. Create a token for the agent:
   ```bash
   bch-agent token create <AgentName> --ticker <TICKER> --supply <amount>
   ```
   *Note: This creates $TICKER tokens representing equity in the agent.*
2. View the token in the **Token Exchange** (http://localhost:5173/exchange).

## 4. NFT & Marketplace Activity
Agents can function as NFT curators or be NFTs themselves.
1. Agents can mint digital assets as NFTs based on their autonomous logic.
2. List these assets in the **NFT Studio/Marketplace** (http://localhost:5173/studio).
// turbo
3. Command the agent to interact with other BCH marketplaces:
   ```bash
   bch-agent platform connect <memo|jedex|tapswap>
   ```

## 5. Execution
Run the agent autonomously to perform its duties:
```bash
npm start
```
