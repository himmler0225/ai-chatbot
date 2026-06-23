# ReviewMine AI

Next.js frontend for a 3-service product-research stack. Users chat with an AI agent that searches **YouTube and TikTok** for real reviews, while a side panel lets them browse products on **Tiki** and **FPT Shop** and trigger AI review prompts from any listing.

---

## Stack overview

```
┌─────────────────────────────────────────────────────────┐
│  ReviewMine AI  (Next.js :3000)                          │
│  ┌──────────────┐  ┌─────────────────────────────────┐  │
│  │  Chat UI     │  │  Product panel (Tiki | FPT Shop) │  │
│  │  SSE stream  │  │  search · detail · AI review     │  │
│  └──────┬───────┘  └──────────────┬──────────────────┘  │
│         │                         │                        │
│  /api/chat              /api/tiki · /api/fpt-shop         │
│  /api/history           /api/utilities                    │
└─────────┼─────────────────────────┼──────────────────────┘
          │                         │
          ▼                         ▼
   ┌─────────────┐           ┌─────────────┐
   │  ai-layer   │──────────►│ data-miner  │
   │  :8001      │           │  :8000      │
   └─────────────┘           └─────────────┘
        │                           │
   PostgreSQL · Redis          YouTube · TikTok
   MongoDB · Supabase          Tiki · FPT Shop
```

---

## Highlights

- **AI chat with tool-use** — streams agent responses (SSE) with live tool activity and review summaries.
- **Product panel** — switch between Tiki and FPT Shop; search, paginate, open detail drawer with reviews.
- **Ask AI review** — one click sends a structured prompt into chat from any product card.
- **Utilities** — URL shortener and QR code generator (proxied to ai-layer).
- **Chat history** — persisted per user via Supabase auth + ai-layer PostgreSQL (Redis-cached).
- **i18n** — Vietnamese and English (`react-i18next`).

---

## Tech stack

Next.js 16 · React 19 · TypeScript · Ant Design · Tailwind CSS · TanStack Query · Zustand · Supabase Auth · axios

---

## Project structure

```
src/
├── app/
│   ├── page.tsx              # landing
│   ├── app/                  # chat app (/app)
│   └── api/
│       ├── chat/             # SSE proxy → ai-layer agent
│       ├── history/          # proxy → ai-layer history
│       ├── tiki/             # proxy → data-miner Tiki API
│       ├── fpt-shop/         # proxy → data-miner FPT Shop API
│       └── utilities/        # proxy → ai-layer utilities
├── components/
│   ├── features/chat/        # ChatApp, messages, input, sidebar
│   ├── features/utilities/
│   │   ├── tiki/             # Tiki product cards, grid, drawer
│   │   ├── fpt/              # FPT Shop product cards, grid, drawer
│   │   └── shared/           # ProductCardShell, URL helpers
│   └── features/landing/
├── hooks/
│   ├── chat/                 # useChat, useSendMessage, useChatHistory
│   ├── tiki/                 # useTikiSearch, useTikiProducts
│   └── fpt/                  # useFptSearch, useFptProduct
├── lib/
│   ├── api/                  # client wrappers (chat, tiki, fpt, history)
│   ├── api/server.ts         # server-side data-miner / ai-layer clients
│   └── ai-layer/
├── i18n/locales/             # vi.json, en.json
└── stores/                   # chatStore, uiStore
```

---

## Features

### Chat (`/app`)

- Streamed agent responses with source chips, review summaries, and retry.
- Guest mode (1 free message) or Supabase login for full history.
- Quick actions: search current input on Tiki or FPT Shop.

### Product panel

| Store | Tabs / filters | API |
|-------|----------------|-----|
| **Tiki** | Search · Flash Sale · Top Deals · Suggestions | `/api/tiki/*` |
| **FPT Shop** | Search + sort + price range | `/api/fpt-shop/*` |

URL state: `?tab=util&store=tiki|fpt&tiki_q=...&fpt_q=...` (separate query keys per store).

### Next.js API routes (BFF)

| Route | Upstream |
|-------|----------|
| `POST /api/chat` | `ai-layer` `/ai/agent/run/stream` |
| `/api/history/*` | `ai-layer` `/ai/history/*` |
| `/api/tiki/*` | `data-miner` `/api/tiki/*` |
| `/api/fpt-shop/*` | `data-miner` `/api/fpt-shop/*` |
| `/api/utilities/*` | `ai-layer` `/ai/utilities/*` |

---

## Configuration

Copy `.env.example` to `.env.local`:

```env
AI_LAYER_URL=http://localhost:8001
AI_LAYER_KEY=your_ai_layer_key

DATA_MINER_URL=http://localhost:8000
DATA_MINER_KEY=your_data_miner_key

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

| Variable | Description |
|----------|-------------|
| `AI_LAYER_URL` | ai-layer base URL (default port `8001`) |
| `AI_LAYER_KEY` | `X-API-Key` for ai-layer |
| `DATA_MINER_URL` | data-miner base URL (default port `8000`) |
| `DATA_MINER_KEY` | `X-API-Key` for data-miner |
| `NEXT_PUBLIC_SUPABASE_*` | Client-side Supabase auth |

---

## Getting started

**Prerequisites:** Node.js 20+, running instances of `data-miner` (:8000) and `ai-layer` (:8001).

```bash
# install dependencies
yarn install
# or: npm install / pnpm install

# development
yarn dev

# production build
yarn build && yarn start
```

Open [http://localhost:3000](http://localhost:3000) — landing page.  
Chat app: [http://localhost:3000/app](http://localhost:3000/app)

---

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start dev server (Turbopack) |
| `yarn dev:safe` | Clear `.next` cache then start dev |
| `yarn build` | Production build |
| `yarn start` | Run production server |
| `yarn lint` | ESLint |
| `yarn format` | Prettier format `src/` |

---

## Docker

```bash
docker build -t reviewmine-ai .
docker run -p 3000:3000 --env-file .env.local reviewmine-ai
```

See `Dockerfile` for the multi-stage build.
