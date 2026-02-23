# BCH Agent Studio - UI/UX Prototype

Welcome to the **BCH Agent Studio**, a premium developer tool for creating, deploying, and monitoring autonomous AI agents on the Bitcoin Cash blockchain.

## ✨ Features

- **Dashboard**: Real-time monitoring of agent activity, transaction logs, and system health.
- **Agent Lab**: A powerful interface to define agent logic (system prompts), on-chain triggers, and autonomy protocols.
- **Contract Base**: Integrated CashScript schema viewer for verifying agent covenants.
- **Vault**: Integrated wallet management for BCH and CashTokens.
- **Network Agnostic**: Single-click toggle between Mainnet and Chip-compliant Testnets.
- **LLM Integration**: Extensible provider system for OpenAI, Anthropic, and local models.

## 🎨 Design System

- **Primary Color**: `#00E339` (BCH Green)
- **Background**: `#05070a`
- **Typography**: Inter (UI) & Outfit (Titles)
- **Aesthetics**: Glassmorphism, Neon Glows, and Micro-animations via `framer-motion`.

## 🛠 Tech Stack

- **Framework**: Vite + React + TypeScript
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS + Vanilla CSS Variables
- **Database**: Supabase (PostgreSQL + Auth)

## 🔐 Authentication & Database (Supabase)

The application uses **Supabase** for secure authentication and real-time database capabilities.

### Setup Instructions

1.  **Create Project**: Go to [Supabase](https://supabase.com) and create a new project.
2.  **Get Credentials**: In your project dashboard, navigate to `Settings > API` to find your `URL` and `anon` key.
3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your-project-url
    VITE_SUPABASE_ANON_KEY=your-anon-key
    ```
4.  **Restart Server**: Run `npm run dev` again to apply changes.

> **Note**: Email confirmation is enabled by default in Supabase. Check your email after signing up, or disable "Confirm email" in `Authentication > Providers > Email` for development speed.

## 🚀 Backend Integration Status

1.  **Authentication**: ✅ Implemented via Supabase (Sign In / Sign Up).
2.  **Agent SDK**: Ready for hookup.
3.  **LLM Engine**: Placeholder ready.
4.  **BCH Indexer**: Planned.
5.  **CashScript Compiler**: Planned.

---
*Created with focus on visual excellence and developer experience.*
