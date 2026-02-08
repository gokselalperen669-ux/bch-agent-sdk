<p align="center">
  <img src="bch-agent-sdk/assets/logo.png" width="200" alt="BCH Agent Framework">
</p>

<h1 align="center">🛡️ BCH Agent Framework</h1>

<p align="center">
  <strong>The Ultimate Platform for Building Autonomous On-Chain AI Agents on Bitcoin Cash</strong>
</p>

<p align="center">
  <em>Empowering developers to create intelligent, self-governing agents that live on the blockchain</em>
</p>

---

## 🌟 Vision & Mission

**BCH Agent Framework** represents the convergence of artificial intelligence and blockchain technology, creating a new paradigm for autonomous digital entities. Our mission is to democratize access to on-chain AI agents, enabling developers to build sophisticated, self-governing systems that operate transparently and securely on the Bitcoin Cash blockchain.

### Why BCH Agent Framework?

- **🤖 True Autonomy**: Agents make independent decisions using advanced LLMs (OpenAI, Anthropic, DeepSeek, Local)
- **🔐 Uncompromising Security**: Built on CashScript covenants for non-custodial, trustless operations
- **💎 Tokenization Ready**: Convert agents into tradable assets with NFT identity + fungible share tokens
- **🌐 Full-Stack Ecosystem**: CLI tools, web dashboard, and API for complete agent lifecycle management
- **🚀 Production Ready**: Export agents as standalone Docker containers for enterprise deployment

---

## 🏗️ Architecture Overview

The BCH Agent Framework consists of four integrated components:

### 1. **BCH Agent SDK** (`/bch-agent-sdk`)
The core framework providing:
- **Agent Templates**: Pre-built architectures (DeFi, NFT, Social, Vault)
- **CashScript Compiler**: Compile smart contracts to on-chain artifacts
- **Wallet Management**: HD wallets with encrypted vault storage
- **LLM Integration**: Multi-provider AI decision engine
- **Network Providers**: Testnet4 and Mainnet connectivity

### 2. **BCH Agent App** (`/bch-agent-app`)
Modern React dashboard featuring:
- **Agent Laboratory**: Visual agent creation and configuration
- **Token Exchange**: Trade tokenized agents with bonding curves
- **Vault Manager**: Secure wallet and asset management
- **Agent Studio**: Monitor and control deployed agents
- **Real-time Analytics**: Track agent performance and blockchain activity

### 3. **BCH Agent API** (`/bch-agent-api`)
Backend services providing:
- **Authentication**: User account management and session handling
- **Data Persistence**: Agent metadata and deployment records
- **Sync Services**: CLI-to-dashboard synchronization

### 4. **CLI Tools** (`bch-agent`)
Command-line interface for:
- **Project Scaffolding**: Initialize agent projects with best practices
- **Agent Lifecycle**: Create, compile, deploy, and monitor agents
- **Tokenization**: Convert agents to tradable CashToken assets
- **Platform Integration**: Connect to BCH ecosystem services

---

## 🔄 Agent Production Workflow

```
┌─────────────────┐
│  1. CLI Setup   │  → Initialize project, configure wallet & AI
└────────┬────────┘
         │
┌────────▼────────┐
│ 2. Agent Design │  → Create agent with templates, define logic
└────────┬────────┘
         │
┌────────▼────────┐
│ 3. Compilation  │  → Compile CashScript contracts to artifacts
└────────┬────────┘
         │
┌────────▼────────┐
│ 4. Deployment   │  → Deploy to BCH blockchain (Testnet/Mainnet)
└────────┬────────┘
         │
┌────────▼────────┐
│ 5. Tokenization │  → (Optional) Create NFT + FT shares
└────────┬────────┘
         │
┌────────▼────────┐
│ 6. Marketplace  │  → List on exchange, enable trading
└─────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ and npm
- Git
- OpenAI API key (or other LLM provider)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bch-agent-framework.git
cd bch-agent-framework

# Setup SDK
cd bch-agent-sdk
npm install
npm run build
npm link

# Setup Web App (Optional)
cd ../bch-agent-app
npm install
npm run dev  # Starts on http://localhost:5173
```

### Your First Agent in 5 Minutes

```bash
# 1. Login (create account at http://localhost:5173 first)
bch-agent login

# 2. Initialize project
bch-agent init my-first-agent
cd my-first-agent

# 3. Setup wallet
bch-agent wallet setup

# 4. Configure AI
bch-agent config set-ai sk-your-openai-key --provider openai

# 5. Create & deploy agent
bch-agent agent create TradingBot --type defi
bch-agent compile
bch-agent deploy TradingBot --network testnet4

# 6. Start autonomous operation
npm start
```

---

## 📚 Complete CLI Command Reference

### 🔐 Authentication (Required First)

| Command | Description |
|---------|-------------|
| `bch-agent login` | Login with web dashboard credentials (stores session in `~/.bch-agent/auth.json`) |

**Example:**
```bash
bch-agent login
# Enter email: user@example.com
# Enter password: ********
```

---

### 🏗️ Project Management

| Command | Description | Options |
|---------|-------------|---------|
| `bch-agent init <name>` | Create new agent project with scaffolding | - |
| `bch-agent doctor` | Diagnose environment (Node, Git, API keys, Vault) | - |
| `bch-agent status` | Show project health and compiled contracts | - |
| `bch-agent info` | Display framework version and system info | - |

**Examples:**
```bash
# Initialize new project
bch-agent init trading-agents

# Check system health
bch-agent doctor

# View project status
bch-agent status
```

---

### 💳 Wallet & Treasury Management

| Command | Description | Options |
|---------|-------------|---------|
| `bch-agent wallet setup` | Interactive wallet creation/import wizard | - |
| `bch-agent wallet create` | Generate new HD wallet (display only) | - |
| `bch-agent wallet save <mnemonic>` | Securely save mnemonic to vault | `-p, --password <pwd>`<br>`-n, --name <name>`<br>`-a, --agent <id>` |
| `bch-agent wallet balance <name>` | Check wallet balance | `-p, --password <pwd>`<br>`-n, --network <network>` |
| `bch-agent wallet list` | List all saved wallets in vault | - |
| `bch-agent wallet derive <mnemonic>` | Derive key from mnemonic | `-i, --index <number>`<br>`-n, --network <network>` |
| `bch-agent wallet send <name> <to> <amount>` | Send BCH from wallet | `-p, --password <pwd>`<br>`-n, --network <network>` |
| `bch-agent faucet <address>` | Get testnet BCH (shows faucet links) | - |

**Examples:**
```bash
# Setup wallet interactively
bch-agent wallet setup

# Check balance
bch-agent wallet balance main --network testnet4

# Send BCH
bch-agent wallet send main bchtest:qr2... 10000 --network testnet4

# Get testnet coins
bch-agent faucet bchtest:qr2...
```

---

### 🤖 Agent Creation & Deployment

| Command | Description | Options |
|---------|-------------|---------|
| `bch-agent agent create <name>` | Generate agent from template | `-t, --type <type>` (defi, nft, social, vault) |
| `bch-agent compile` | Compile all `.cash` contracts to artifacts | - |
| `bch-agent deploy <agent-name>` | Deploy agent to blockchain | `-n, --network <network>`<br>`-f, --fee <satoshis>` |
| `bch-agent logs <agent-name>` | Stream agent activity logs | `-f, --follow` |
| `bch-agent test` | Run integration tests | - |
| `bch-agent export <agent-name>` | Create production Docker package | `-o, --output <dir>` |

**Examples:**
```bash
# Create DeFi agent
bch-agent agent create AlphaBot --type defi

# Compile contracts
bch-agent compile

# Deploy to testnet
bch-agent deploy AlphaBot --network testnet4

# Watch logs
bch-agent logs AlphaBot --follow

# Export for production
bch-agent export AlphaBot --output ./production
```

---

### 💎 Agent Tokenization (Pump.fun Model)

| Command | Description | Options |
|---------|-------------|---------|
| `bch-agent token create <agent-name>` | Tokenize agent with NFT + FT shares | `-s, --supply <amount>`<br>`-t, --ticker <symbol>` |
| `bch-agent token list <agent-name> <price>` | List tokens on marketplace | Price in BCH per 1000 tokens |

**Requirements:**
- Agent must be deployed first
- User must be logged in
- Creates bonding curve with 85% community / 15% liquidity split

**Examples:**
```bash
# Tokenize agent
bch-agent token create AlphaBot --ticker ALPHA --supply 1000000

# List on marketplace
bch-agent token list AlphaBot 0.01

# View at: http://localhost:5173/marketplace
```

---

### 🌐 Platform Integration

| Command | Description | Options |
|---------|-------------|---------|
| `bch-agent platform connect <platform>` | Connect to BCH platforms | Platforms: jedex, memo, cauldron |
| `bch-agent platform deploy <platform> <agent>` | Deploy agent to platform | - |
| `bch-agent market` | Fetch live BCH price and network stats | - |

**Examples:**
```bash
# Connect to JEDEX
bch-agent platform connect jedex

# Deploy to memo.cash
bch-agent platform deploy memo AlphaBot

# Check market data
bch-agent market
```

---

### ⚙️ Configuration & Utilities

| Command | Description | Options |
|---------|-------------|---------|
| `bch-agent config show` | Display current configuration | - |
| `bch-agent config set-ai <key>` | Configure AI provider | `--provider <name>`<br>`--model <model>` |

**Examples:**
```bash
# View config
bch-agent config show

# Set OpenAI
bch-agent config set-ai sk-... --provider openai --model gpt-4o

# Set Anthropic
bch-agent config set-ai sk-ant-... --provider anthropic --model claude-3-5-sonnet

# Set DeepSeek
bch-agent config set-ai sk-... --provider deepseek --model deepseek-chat
```

---

## 📂 Repository Structure

```
bch-agent-framework/
├── bch-agent-sdk/              # Core SDK and CLI
│   ├── src/
│   │   ├── cli/                # Command-line interface
│   │   │   └── commands/       # All CLI commands
│   │   ├── core/               # Agent runtime engine
│   │   ├── network/            # Blockchain providers
│   │   ├── utils/              # Wallet, vault, sync utilities
│   │   └── index.ts            # SDK exports
│   ├── contracts/
│   │   └── templates/          # Agent contract templates
│   ├── assets/                 # Logo and branding
│   └── package.json
│
├── bch-agent-app/              # Web dashboard (React + Vite)
│   ├── src/
│   │   ├── pages/              # Dashboard pages
│   │   │   ├── AgentLab.tsx    # Agent creation UI
│   │   │   ├── TokenExchange.tsx # Trading interface
│   │   │   ├── Vault.tsx       # Wallet management
│   │   │   └── ...
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Auth and state management
│   │   └── App.tsx
│   └── package.json
│
├── bch-agent-api/              # Backend API (Express)
│   ├── src/
│   │   ├── routes/             # API endpoints
│   │   └── server.ts
│   └── package.json
│
└── README.md                   # This file
```

---

## 🧠 Core Technologies

| Technology | Purpose |
|------------|---------|
| **CashScript** | Smart contract language for Bitcoin Cash covenants |
| **CashTokens** | NFT identity + fungible token standard for agents |
| **OpenAI / Anthropic / DeepSeek** | LLM providers for agent decision-making |
| **Commander.js** | CLI framework for developer tools |
| **React + Vite** | Modern web dashboard with Tailwind CSS |
| **Framer Motion** | Smooth animations and transitions |
| **Express.js** | RESTful API backend |
| **TypeScript** | Type-safe development across all components |

---

## 🎯 Use Cases

### 1. **DeFi Trading Agents**
Autonomous bots that analyze market conditions and execute trades on BCH DEXs.

### 2. **NFT Curators**
Agents that discover, evaluate, and acquire NFTs based on predefined criteria.

### 3. **Social Media Managers**
Automated posting and engagement on memo.cash and other BCH social platforms.

### 4. **Treasury Vaults**
Secure, multi-signature agents for organizational fund management.

### 5. **Tokenized AI Services**
Create tradable agents where token holders share in agent profits.

---

## 🐳 Production Deployment

When your agent is ready for production:

```bash
# Export agent
bch-agent export MyAgent --output ./deploy

# Build Docker image
cd ./deploy
docker build -t bch-agent-myagent .

# Run in production
docker run -d \
  --name myagent \
  --env-file .env \
  --restart unless-stopped \
  bch-agent-myagent

# View logs
docker logs -f myagent
```

---

## 📖 Documentation

- **[SDK Documentation](bch-agent-sdk/README.md)** - Complete SDK reference
- **[Usage Guide](bch-agent-sdk/USAGE_GUIDE.md)** - Step-by-step tutorials
- **[Web App Guide](bch-agent-app/README.md)** - Dashboard documentation
- **[API Reference](bch-agent-api/README.md)** - Backend API docs

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

Built with ❤️ for the Bitcoin Cash developer ecosystem.

---

## 🔗 Links

- **Website**: [Coming Soon]
- **Documentation**: [docs.bch-agent.dev]
- **Discord**: [Join Community]
- **Twitter**: [@BCHAgentFramework]

---

<p align="center">
  <strong>Empowering the future of autonomous blockchain agents</strong>
</p>
