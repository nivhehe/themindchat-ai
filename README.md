# MindChat AI

**MindChat AI** is a free, private, no-sign-up AI chat assistant powered by Google Gemini 2.5 Flash. Built with Astro and a Cloudflare Worker proxy.

**Live at:** [https://themindchat.online](https://themindchat.online)

---

## Tech Stack

- **Frontend:** [Astro](https://astro.build/) 6 (static site generation)
- **AI Model:** Google Gemini 2.5 Flash
- **API Proxy:** Cloudflare Worker (`mindchat-proxy`) with multi-key failover
- **3D Graphics:** Spline Viewer (interactive 3D scene on landing page)
- **Analytics:** Google Analytics 4
- **Hosting:** Cloudflare Pages (`themindchat.online`)

---

## Project Structure

```
/
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── assets/
│   │   └── background.svg
│   ├── components/
│   │   └── Welcome.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       ├── index.astro       # Landing page (Spline 3D scene)
│       ├── chat.astro        # Chat interface
│       ├── about.astro
│       ├── contact.astro
│       ├── privacy.astro
│       ├── terms.astro
│       ├── 404.astro
│       └── 500.astro
├── workers/
│   └── chat-proxy/
│       ├── wrangler.toml
│       └── src/
│           └── index.ts      # Gemini API proxy with key rotation
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Features

- No sign-up or account required
- Privacy-first — no conversation data stored
- Dark / light / pink theme toggle
- Interactive 3D robot on landing page (Spline)
- Suggested prompts for quick-start conversations
- Code block formatting in responses
- Copy-to-clipboard on messages
- Keyboard shortcut `Cmd/Ctrl+K` to focus chat input
- Mobile-responsive with touch interaction hints

---

## Getting Started

### Prerequisites

- Node.js >= 22.12.0

### Install

```sh
npm install
```

### Dev Server

```sh
npm run dev
```

Opens at `http://localhost:4321`.

### Build

```sh
npm run build
```

Output goes to `dist/`.

---

## Cloudflare Worker (API Proxy)

The chat backend is a Cloudflare Worker that proxies requests to the Gemini API.

### Deploy

```sh
cd workers/chat-proxy
npx wrangler deploy
```

Requires `GEMINI_API_KEY` secret (comma-separated keys for failover):

```sh
npx wrangler secret put GEMINI_API_KEY
```

---

## Domain Redirect

Any visit to `*.pages.dev` or other unauthorized hosts is redirected to `https://themindchat.online/` via:

- Client-side JS redirect in `Layout.astro`
- Dynamic `<link rel="canonical">` tags
- Sitemap pointing only to `themindchat.online`

---

## License

MIT
