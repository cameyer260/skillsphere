🎮 PlaySkillSphere

A real-time multiplayer gaming platform where users can add friends, create lobbies, and compete in bite-size games like Tic-Tac-Toe, Connect-Four, and more. Built with modern web tech for a smooth, ad-free experience on desktop and mobile.

✨ Features

🕹 Multiple Games — Tic-Tac-Toe, Connect-Four, Pong, and more in development.

👥 Add Friends — connect instantly and invite them to games.

⚡ Realtime Lobbies — powered by WebSockets for smooth gameplay.

🔒 Secure Sign-In — Email/Password or Google OAuth.

🎨 Custom Avatars — personalize your profile and stand out on leaderboards.

🚀 Minimal, Fast UI — no clutter, no ads.

🌍 Cross-Platform — works on desktop and mobile.

🛠 Tech Stack

Framework: Next.js (App Router, Server Actions)

Styling: Tailwind CSS + shadcn/ui

Auth: Supabase Auth (Email/Password, Google OAuth)

Realtime: WebSockets (DigitalOcean VPS)

Database: Supabase (Postgres)

Deployment: Vercel (frontend) + DigitalOcean VPS (WebSocket server)

🚀 Getting Started
1. Clone the repo
git clone https://github.com/your-username/playskillsphere.git
cd playskillsphere

2. Install dependencies
npm install

3. Configure environment variables

Create a .env.local file in the root:

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
WEBSOCKET_SERVER_URL=wss://your-vps-domain

4. Run locally
npm run dev


Visit: http://localhost:3000

📜 License

MIT License © 2025 Christopher Meyer

👉 Live Demo: https://playskillsphere.com
