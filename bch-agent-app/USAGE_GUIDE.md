# BCH Agent Platform - Hybrid Workflow Guide

This platform uses a **Hybrid Architecture** where the CLI (Command Line Interface) handles secure generation and heavy lifting, while the Web Interface provides a modern dashboard for management and operations.

## 🔗 Connection Flow

1.  **Web Account (Hub):**
    *   Everything starts at the Web Dashboard.
    *   You create an account (e.g., `operator@bch.org`).
    *   This account acts as the central synchronization point.

2.  **CLI Authentication:**
    *   Open your terminal.
    *   Run `bch-agent login`.
    *   Enter your Web Account credentials.
    *   **Result:** The CLI is now "paired" with your web profile.

## 🛠️ Workflow: Creating & Syncing

### 1. Wallets (The Vault)
*   **Action (CLI):** Run `bch-agent wallet setup`.
*   **Result:** The CLI generates a secure HD Wallet and saves it locally (`.vault` file).
*   **Sync:** Automatically, the CLI sends the *Public Address* and *Name* to your Web Dashboard.
*   **Web View:** Go to the **Vault** page. You will see your new wallet listed instantly.
*   **Operations:**
    *   To transact on the web, click **Unlock**.
    *   Enter the mnemonic (provided by CLI) *once* to enable signing in the browser.

### 2. Agents (The Lab)
*   **Action (CLI):** Run `bch-agent agent create <name>`.
*   **Result:** The CLI generates the smart contracts (`.cash`) and TypeScript logic (`.ts`).
*   **Sync:** The agent's ID and Status are pushed to the Web Dashboard.
*   **Web View:** Go to **Agent Lab**. Your agent appears in "Synced Agents".
*   **Operations:**
    *   You can monitor its activity logs.
    *   You can Start/Stop the agent (updates status).

## 🚀 Summary
*   **CLI** = Factory & Security Core (Generates Keys/Contracts)
*   **Web** = Command Center (Monitoring, sending txs, managing fleet)

> **Security Note:** Private keys are generated offline in CLI. They are never sent to the server. You only provide them to the Web Interface locally if you want to sign transactions from the browser.
