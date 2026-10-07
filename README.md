# THEFT: Police & Undercover 👮🕵️🥷
> **Real-Time Multiplayer Social-Deduction Game**

[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Socket.IO](https://img.shields.io/badge/RealTime-Socket.IO-010101?style=flat-square&logo=socketdotio)](https://socket.io)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-000000?style=flat-square&logo=express)](https://expressjs.com)

---

## 1. GAME CONCEPT & RULES

**THEFT: Police & Undercover** is a high-stakes, real-time social deduction game supporting **4–10 players** per room.

### The Secret Roles

| Role | Badge | Alignment | Objectives & Victory Condition |
| :--- | :---: | :--- | :--- |
| **Police** | 👮 | Law Enforcement | • Uncover forensic evidence (CCTV, fingerprints, logs)<br>• Cross-examine suspects in open radio discussion<br>• Indict and eliminate the Thief in the tribunal vote<br>**WIN**: Thief is arrested. |
| **Undercover** | 🕵️ | Heist Syndicate | • Secretly allied with the Thief<br>• Plant doubt, fabricate alibis, and misdirect investigations<br>• Protect the Thief from tribunal ballots<br>**WIN**: Thief evades arrest or completes the heist. |
| **Thief** | 🥷 | Master Infiltrator | • Execute covert heist objectives (crack vault, cut CCTV)<br>• Maintain plausible deniability during discussions<br>• Survive without being indicted<br>**WIN**: All heist tasks finished or evades final arrest. |

---

## 2. ROUND PHASES

1. **Phase 1 — Role Reveal (10s)**:
   Top-secret personal assignment displayed server-side with unique directive.
2. **Phase 2 — Forensic Investigation (60s)**:
   Police inspect CCTV feeds, run fingerprint and location checks. Thief executes stealth objectives.
3. **Phase 3 — Open Interrogation Discussion (120s)**:
   Real-time tactical chat channel. Players present clues, interrogate suspects, and identify contradictions.
4. **Phase 4 — Tribunal Voting (45s)**:
   Secret plurality ballot. Highest-voted player is indicted and eliminated.
5. **Phase 5 — Results & Game Over**:
   If the Thief is arrested, Police win. If an innocent is arrested or the Thief completes the heist, the Undercover & Thief triumph.

---

## 3. ARCHITECTURE & SECURITY

- **Server-Authoritative Anti-Cheat**: Role distributions, vote tallies, and private clues are generated exclusively on the backend. Clients *never* receive roles of other players until match conclusion.
- **AI Bot Simulation**: Includes built-in AI Operatives (`BotService`) to allow full solo testing of 4 to 10 player games with 1 click.
- **Dual Engine Deployment**:
  1. **Full-Stack TypeScript Architecture** (`shared/`, `server/`, `client/`).
  2. **Zero-Dependency Fast-Server Engine** (`server.js`, `index.html`) ready for rapid one-command deployment.

---

## 4. PROJECT STRUCTURE

```text
├── client/                     # React 18 + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/         # Navbar, Timer, EvidenceCard, PlayerCard, ChatBox, Modals
│   │   ├── hooks/              # useAuth, useGame
│   │   ├── pages/              # MainMenu, Lobby, RoleReveal, Investigation, Discussion, Voting, GameOver
│   │   ├── services/           # Socket.IO client, API fetch client, Web Audio synth
│   │   ├── App.tsx             # Main phase view orchestrator
│   │   └── main.tsx            # Entrypoint
│   └── vite.config.ts
├── server/                     # Express + Socket.IO + Mongoose backend
│   ├── src/
│   │   ├── controllers/        # authController, roomController, adminController
│   │   ├── middleware/         # authMiddleware, antiCheat
│   │   ├── models/             # User, GameRoom, Game
│   │   ├── routes/             # authRoutes, roomRoutes, adminRoutes
│   │   ├── services/           # GameManager, RoleDistributor, EvidenceGenerator, BotService
│   │   ├── sockets/            # socketManager (real-time events)
│   │   └── server.ts           # Express & Socket.IO server bootstrap
├── shared/                     # Shared TypeScript types & Socket event definitions
│   └── types/index.ts
├── server.js                   # Zero-dependency fast-server with live MongoDB Atlas support
├── index.html                  # Standalone noir tactical client
├── .env.example                # Template of required environment variables
└── README.md
```

---

## 5. ENVIRONMENT VARIABLES

Create a `.env` file in the root directory (never commit this to GitHub):

```env
# Server Port
PORT=3000

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# JWT Secret for Session Authentication
JWT_SECRET=super_secret_theft_jwt_key_2026_change_in_production

# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://chiduranarsimhareddy7_db_user:M56mXx3wFZnFE4D7@cluster0.3dtztmm.mongodb.net/theft_game?retryWrites=true&w=majority

# Database Name
DB_NAME=theft_game
```

---

## 6. LOCAL DEVELOPMENT

### Install & Run All Services:
```bash
# 1. Install root & workspace packages
npm install
npm --prefix shared install
npm --prefix server install
npm --prefix client install

# 2. Run both server and client concurrently
npm run dev

# 3. Or run the zero-dependency instant engine:
node server.js
```
Open [http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173).

---

## 7. DEPLOYMENT INSTRUCTIONS

### Option A: Google Cloud Deployment (Cloud Run / App Engine)
1. Install [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
2. Authenticate: `gcloud auth login`.
3. Set your project: `gcloud config set project YOUR_PROJECT_ID`.
4. Deploy using Cloud Run:
   ```bash
   gcloud run deploy theft-game \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars MONGODB_URI="mongodb+srv://chiduranarsimhareddy7_db_user:M56mXx3wFZnFE4D7@cluster0.3dtztmm.mongodb.net/theft_game",JWT_SECRET="theft_prod_secret"
   ```

### Option B: Render / Railway Deployment (Recommended for Socket.IO)
1. Fork or push this repository to GitHub (`https://github.com/Narsimha7/theft-game`).
2. Go to [Render.com](https://render.com) -> New **Web Service**.
3. Select your repository `theft-game`.
4. Configure:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `MONGODB_URI`: `mongodb+srv://chiduranarsimhareddy7_db_user:M56mXx3wFZnFE4D7@cluster0.3dtztmm.mongodb.net/theft_game`
     - `JWT_SECRET`: `theft_prod_secret_2026`
     - `PORT`: `10000`
5. Click **Deploy**. Your multiplayer game will be live globally!

### Option C: Vercel / Netlify (Frontend)
1. Connect `client/` subdirectory to Vercel/Netlify.
2. Set build command: `npm run build`, output directory: `dist`.
3. Set `VITE_API_URL` to your backend Render/Cloud Run URL.

---

## 8. LICENSE
MIT License © 2026 Narsimha
