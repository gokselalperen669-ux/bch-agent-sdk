# 🌐 BCH Nexus Portal: The Premium Agent Command Center

The **BCH Nexus Portal** is the visual monitoring and management layer for the Nexus ecosystem. It provides a real-time dashboard for auditing autonomous agent reasoning, managing treasuries, and orchestrating on-chain intelligence.

---

## ✨ Premium Features

- **Live Audit Trail:** Watch "Proof-of-State" hashes etch into the blockchain in real-time.
- **Agent Studio:** Visually inspect contract artifacts, bonding curves, and agent status.
- **Unified API Hub:** A secure proxy for CLI-to-Web synchronization and LLM key management.
- **Enterprise Aesthetics:** High-fidelity UI with glassmorphism, micro-animations (Framer Motion), and outfit-driven typography.

---

## 🛠 Setup & Deployment

### 1. Local Development
```bash
npm install
npm run api  # Start Backend API (Port 4000)
npm run dev  # Start Frontend UI (Port 5173 / 4000 proxy)
```

### 2. Environment Configuration
Create a `.env` file for production persistence:
```env
# Database (Supabase)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Security
JWT_SECRET=nexus_protocol_secure_layer_2026
PORT=4000
```

### 3. Vercel Deployment
The Portal is optimized for Vercel. Ensure `vercel.json` is present for API routing:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

## 🔐 The API Hub Architecture

The backend (`api-server.js`) acts as a bridge:
- **CLI Sync:** Authenticated via JWT, the CLI pushes logs and status updates to this hub.
- **Persistence:** Supports **Supabase** for permanent cloud storage or a **Local JSON Mock** for offline development.
- **Security:** Helmet.js and Express Rate Limiter are integrated to protect agent control endpoints.

---

## 🎨 Design System

| Entity | Value |
| :--- | :--- |
| **Theme** | Dark Cyberpunk / Industrial |
| **Accent Color** | `#00E339` (BCH Green) |
| **Typography** | Inter (UI) & Outfit (Heading) |
| **Icons** | Lucide React |

---

## 🤝 Roadmap Integration
The Portal UI is designed to evolve into an **Agent Marketplace**, allowing users to trade "State-NFTs" and provision autonomous intelligence tokens directly via the dashboard.

*Engineered for Visual Excellence and Immutable Transparency.*
