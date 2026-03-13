# Security Rules

## Data storage

- All persistence is **IndexedDB only** (DB: `ai-chat-config`, store: `config`). No backend, no server-side storage.
- API keys are stored in IndexedDB in the browser. Never log them to the console, include them in error messages, or expose them in the DOM.
- Do not add `localStorage`/`sessionStorage` as an alternative store — IndexedDB is the single source of truth.

## LLM API requests

- User-supplied endpoints (`config.endpoint`) are used directly in `fetch`. Do not sanitize or restrict them — users intentionally point to local/remote LLM servers.
- Authorization header is added only when `config.apiKey` is non-empty:
  ```ts
  ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {})
  ```
  Keep this pattern; do not send the header unconditionally.
- Never relay API keys to any URL other than the user-configured endpoint.

## CORS and proxy

- GPT4ALL in dev: proxied via Vite at `/api/gpt4all` → `http://localhost:4891`. Do not add new dev-only proxy rules without documenting them in `vite.config.ts` and `CLAUDE.md`.
- Ollama in prod: requires `OLLAMA_ORIGINS=*` on the server. Do not work around CORS client-side (e.g., with `mode: "no-cors"`) — it hides errors and breaks response parsing.
- sirv is started with `--cors` in production (`bin/start.js`) to allow cross-origin requests to the static file server itself.

## Markdown rendering

- `marked` renders LLM responses. XSS is the primary risk. Do not set `marked` options that disable sanitization or enable raw HTML unless the output is explicitly sandboxed.
- If `marked` options are changed, verify that `<script>` and event-handler attributes in model output are not executed.

## Input handling

- The system prompt and chat input are sent verbatim to the LLM endpoint. No server-side validation exists. Client-side UI validation (e.g., required fields) is acceptable but not a security boundary.
- Do not `eval()` or `new Function()` on any content received from LLM responses.

## Secrets in code

- `vite.config.ts` must not contain credentials. Environment variables prefixed with `VITE_` are embedded in the built bundle — do not use them for secrets.
- `.env` files should be in `.gitignore`. If one is created, confirm it is not committed.
