# 🚀 Nexus Launch Checklist: Moving Beyond Localhost

To open Nexus to the public (global launch), you need to transition from your local development environment to a production-grade infrastructure. Follow these steps to become a global Autonomous Agent Service Provider.

---

## 1. 📡 Backend Deployment (Nexus HQ)
The API server (`api-server.js`) is the brain of your ecosystem. It must be reachable via a public URL (HTTPS).

- **Recommended Hosting:** [Render](https://render.com), [Railway](https://railway.app), or [DigitalOcean App Platform].
- **Deployment Method:** Use the `bch-agent-app/Dockerfile.api`.
- **Enviroment Variables to Set:**
  - `PORT`: 4000 (standard)
  - `DATABASE_PATH`: `/etc/nexus/db.json` (or any persistent volume path)
  - `NODE_ENV`: `production`

---

## 2. 🎨 Frontend Deployment (Web Dashboard)
The React/Vite application must be hosted on a global CDN.

- **Recommended Hosting:** [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
- **Enviroment Variables to Set:**
  - `VITE_API_URL`: Your public Backend URL (e.g., `https://api.yournexus.com`)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

## 3. 🛠️ CLI Configuration for Users
Once your services are live, users (and yourself) must point their CLI to the global Nexus HQ.

- **Set Global URL:**
  ```bash
  # In PowerShell/Terminal
  export AGENT_API_URL="https://api.yournexus.com"
  export AGENT_DASHBOARD_URL="https://nexus.yourdomain.com"
  ```
- **Login:** Users will now run `bch-agent login` and it will connect to your production server instead of `localhost`.

---

## 4. 🗄️ Database Strategy
Currently, Nexus uses `db.json` for simplicity. For a large public launch:
- **Scalability:** Consider migrating the `readDB/writeDB` logic in `api-server.js` to a real database like **PostgreSQL** or **MongoDB**.
- **Supabase Integration:** You can use the Supabase JS client to replace the local JSON file handling for even more robustness.

---

## 5. 🤖 Autonomous Node Deployment
Your agents don't have to run on your laptop anymore. Use the `bch-agent export` feature to package them:
- **Standalone Agents:** Deploy the exported Docker containers to a VPS or a cloud worker.
- **7/24 Runtime:** Since they are autonomous, they will continue to ratiocinate and execute on-chain actions based on their internal memory and peer signals without you being online.

---

## 📈 Next Steps for Phase 2:
1. **Domain Names:** Connect a custom domain (e.g., `nexus-hq.io`).
2. **SSL Certificates:** Ensure all traffic is encrypted via HTTPS (Automatic on Vercel/Render).
3. **Public API Key:** If you provide AI for your users, secure your LLM API keys on the server side.

**Congratulations! Your BCH Agent Framework is now ready for Global Dominance.** 🌍🛡️
