# Portfolio workspace release

## Runtime configuration

AI requests go through `/api/chat` on the portfolio Worker. Set the Worker runtime secret `OPENROUTER_API_KEY` in Cloudflare (or `npx wrangler secret put OPENROUTER_API_KEY`). A build-only `VITE_OPENROUTER_API_KEY` does not configure the runtime and is no longer used. Never put the provider key into a Vite variable. Rotate any key previously distributed in client assets.

`npm run build` generates the server-owned document context and builds static assets. Wrangler bundles `worker/index.js`, serves `dist` through `ASSETS`, and applies its `CHAT_RATE_LIMITER` binding (10 requests per IP per minute per Cloudflare location). This is an abuse limit, not a global spending cap. Missing runtime configuration returns a controlled 503; document navigation and slash commands remain available.

For local full-stack testing: `npm run build`, place the secret in ignored `.dev.vars`, and run `npx wrangler dev`. Vite-only development serves the UI without the Worker endpoint.

## Verification

Run `npm test` and `npm run build`. Check document source/preview, search to source line, preview/pinned tabs, settings, Agent modes and context, stop/retry, and Claude repeated output and session restore. Verify provider streaming on the deployed endpoint after the secret is available.

## Storage and scope

Sessions stay in this browser, bounded to 20 conversations per shell and 100 transcript entries per conversation. Storage failures fall back to in-memory sessions. Documents are read-only; commands operate on the portfolio, not an operating-system shell. Existing project and prep links remain supported.

### Release verification (2026-09-15)

- 17 Node tests pass, covering document routes/tab state, loading order and interruption, text reveal, session storage, request validation/rate limiting, and SSE parsing.
- Production Vite build and Wrangler deploy dry run pass; changed-code ESLint passes.
- Browser checks: document preview/source, content search to matching line, font/motion persistence across reload, interrupted Claude transcript restoration, rename/resume, repeated `/projects`, mobile navigation/layout bounds, Agent Shift+Tab modes, and Tab-completed document context.
- Full repository lint still reports existing issues in `src/prep/parseMermaid.js`; those are outside this release.
- Provider success remains dependent on the production Worker secret; mock-provider tests do not establish live provider availability.
