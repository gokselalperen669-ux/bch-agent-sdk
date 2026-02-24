---
description: BCH Agent Lifecycle Workflow
---

This workflow describes the end-to-end process of creating, configuring, and launching an automated BCH AI Agent using the CLI.

### 1. Project Initialization
// turbo
1. Initialize a new project directory:
   `bch-agent init <project-name> --yes`

### 2. Authentication
2. Log in to the Nexus Protocol:
   `bch-agent login`
   (Note: Use your email and the master password if in development mode)

### 3. Wallet Configuration
3. Set up the agent's treasury wallet:
   `bch-agent wallet setup`
   - Select: `Generate a new wallet`
   - Name: `agent-treasury`
   - Password: `default` (or your chosen vault password)

### 4. Agent Creation
4. Generate a new agent instance:
   `bch-agent agent create <agent-name> --type defi`
   (Available types: `defi`, `nft`, `social`, `vault`)

### 5. AI Configuration
5. Set up the AI intelligence layer:
   `bch-agent config set-ai <your-api-key> --provider openai --model gpt-4o`

### 6. Compilation & Deployment
6. Compile the generated smart contract:
   `bch-agent compile`

7. Deploy the agent to the network:
   `bch-agent deploy <agent-name> --network testnet4 --wallet agent-treasury`

### 7. Execution & Monitoring
8. Start the agent's autonomous cycle:
   `npm install` (First time only)
   `npm start`

9. Monitor logs:
   `bch-agent logs <agent-name> --follow`

10. Check project status:
    `bch-agent status`
