# System design audit

Dream Home Builders is a static React + Vite marketing site (Azure Static Web Apps). There is no API server, database, or worker. Per the standard, depth is scaled to that: CDN, caching, security, and monitoring matter; load balancing, database design, and queues do not.

Existing rule `.cursor/rules/dual-remote-push.mdc` is kept. It covers git remotes, not runtime design, so it does not conflict with `.cursor/rules/system-design.mdc`.

## 1. System architecture

**Applies:** lightly. This is a client-only SPA.

**In place**

- UI sections live under `src/components/`; copy and form endpoints live in `src/data/content.ts` and `src/data/walkthrough.ts`.
- The only outbound call is isolated in `src/lib/formspree.ts`.
- Below-the-fold sections are code-split with `React.lazy` in `src/App.tsx`.
- No process memory or local disk is used as shared server state. Form and scroll state stay in the browser.

**Gaps**

- No public API, so versioning and boundary validation (zod and similar) do not exist. Forms rely on HTML `required` / `type="email"`.
- Config is hardcoded. Formspree URLs in `src/data/content.ts` are public form ids, not secrets, but there is no `.env.example`. `.gitignore` ignores `.env.*`, which also ignores `.env.example`.

**Fixes**

- Low: if form ids move to env vars, add `.env.example` and un-ignore that filename.
- Low: add a validation schema only if a real API is introduced. Keep routes / services / data access split at that point.

## 2. Load balancing

**Applies:** no. Azure Static Web Apps terminates TLS and serves files. There is no app process, sticky session, or SIGTERM handler to write.

**In place:** platform hosting only. `public/staticwebapp.config.json` sets SPA fallback and media routes, not health checks.

**Gaps:** no `/health` or `/ready`. Not useful until a service exists.

**Fixes:** none for this site. Add liveness/readiness and graceful shutdown only with a backend.

## 3. Caching

**Applies:** yes.

**In place**

- `public/staticwebapp.config.json` sets `Cache-Control: public, max-age=31536000, immutable` on `/assets/*` (Vite content-hashed JS/CSS).
- Same file sets `public, max-age=604800` (7 days) on `/videos/*`. The film URL is cache-busted with `?v=5` in `src/data/walkthrough.ts`.
- `prefetchVideoBlob` in `src/components/video/VideoScrollSequence.tsx` uses `cache: 'force-cache'`.

**Gaps**

- `index.html` has no short or `no-cache` header, so a cached shell can keep pointing at old hashed bundles after deploy.
- The hero film (~33MB, `public/videos/hero-walkthrough.mp4`) is fully buffered into a `Blob` in JS memory. That is not a TTL cache and it is the main client memory cost.
- No explicit `ETag` / `Last-Modified` config (the host may add them).

**Fixes**

- High: set `Cache-Control: no-cache` on HTML in `public/staticwebapp.config.json`.
- Medium: stop holding the whole MP4 in memory; let the video element use HTTP range requests and the 7-day cache. Keep the `?v=` bump when the file changes.
- Low: add `ETag` only if the host is not already sending one.

## 4. Database design

**Applies:** no. Content is TypeScript modules. Quote and contact submissions are stored by Formspree, outside this repo. No schema, migrations, indexes, or connection pool.

**Fixes:** none until this repo owns data. Then use migrations, indexes, pagination, and timestamps from the start.

## 5. Message queues

**Applies:** no. The slow side effect is a browser `POST` to Formspree (`src/lib/formspree.ts`). Delivery, retries, and spam filtering are Formspree’s. There is no job id, backoff, or dead-letter queue to add here.

**Gaps (client only):** the fetch has no timeout. The submit button disables while `status === 'sending'` (`src/components/sections/Contact.tsx`, `src/components/sections/Quote.tsx`), which limits double submits in one tab.

**Fixes**

- Low: abort the Formspree `fetch` after a few seconds and show the existing error message. Do not add BullMQ, SQS, or similar for this site.

## 6. CDN

**Applies:** yes. Static files are served by Azure Static Web Apps (edge CDN + HTTPS). Photos come from `images.unsplash.com`. Fonts come from Google Fonts.

**In place**

- Fingerprinted bundles under `/assets/*`, with `gsap` and `framer-motion` split in `vite.config.ts`.
- Unsplash URLs request a width and quality (`src/data/content.ts`). Below-the-fold images use `loading="lazy"` and `decoding="async"` (`src/components/shared/ParallaxImage.tsx` and section components).
- `index.html` preconnects to `fonts.googleapis.com`, `fonts.gstatic.com`, and `images.unsplash.com`. The font CSS URL includes `display=swap`.
- Video MIME types are set, and the SPA fallback excludes video and asset paths (`public/staticwebapp.config.json`).

**Gaps**

- One 33MB H.264 MP4 and a 1440×810 JPEG poster (`public/videos/hero-poster.jpg`). No WebM/AV1, no mobile rendition, no responsive `srcset`.
- `public/logo-dhb.png` is 1024×757 (~442KB) and rendered at 40px (`src/components/layout/Navbar.tsx`).
- Photography is hotlinked, so the page depends on Unsplash availability and sends visitor requests to a third party.
- Compression and HTTP/2 are not configured in-repo (the Azure edge usually provides both; this repo does not prove it).

**Fixes**

- High: re-encode the hero (lower bitrate, a smaller mobile file, WebM alongside MP4) and serve a WebP/AVIF poster.
- Medium: export the logo at display size. Add `srcset` / `sizes` if first-party photos replace Unsplash.
- Low: self-host Cormorant Garamond and Outfit if the extra Google Fonts request shows up in LCP.

## 7. Scalability

**Applies:** only as static hosting. Instances are stateless; Azure scales the files. Expected load is a small marketing site. The first bottleneck is the hero film, not CPU or a database.

**In place:** code splitting (`src/App.tsx`), manual vendor chunks (`vite.config.ts`), and a client-side in-flight lock on the forms.

**Gaps**

- Prefetch reads the entire MP4 into RAM (`VideoScrollSequence.tsx`). On a phone that is the scaling limit.
- Form `fetch` has no timeout or request-size cap (the payload is small text, so size is not a real risk).
- No app-level rate limit. Formspree applies its own; this repo does not.

**Fixes**

- High: same as caching — do not buffer the full film in memory.
- Medium: add an `AbortSignal` timeout on `submitFormspree`.
- Low: add rate limiting only if a backend replaces Formspree.

## 8. Reliability and security

**Applies:** yes for the forms, headers, and supply chain. Database backups, circuit breakers, auth, and password hashing do not apply.

**In place**

- Form failures return a user-facing string and do not surface a stack (`src/lib/formspree.ts`).
- Video prefetch failure falls back to the direct file URL (`VideoScrollSequence.tsx`).
- `.gitignore` excludes `.env`, `.env.*`, and logs. No secrets are checked in. Phone and email in `src/data/content.ts` and `index.html` are public business contact details.
- External links use `rel="noopener noreferrer"` (`src/components/layout/Footer.tsx`, `src/components/sections/Contact.tsx`).
- `npm run lint` runs oxlint (`.oxlintrc.json`). There is no test script.

**Gaps**

- `public/staticwebapp.config.json` sets no CSP, HSTS, `X-Content-Type-Options`, frame protection, or `Referrer-Policy`.
- No React error boundary.
- No tests and no CI (no `.github/workflows`). Dependencies are not audited in automation.
- Public forms have no honeypot; spam control is entirely Formspree. A hung POST leaves the button on “Sending...”.

**Fixes**

- High: add `globalHeaders` on the Static Web App (CSP allowing this origin, Formspree, Unsplash, Google Fonts, and the Maps embed; `nosniff`; `frame-ancestors 'none'` or a tight allowlist; `Referrer-Policy`).
- Medium: CI that runs `npm run lint` and `npm run build`, plus Dependabot or `npm audit`.
- Medium: honeypot field and a fetch timeout on both forms; a top-level error boundary in `src/main.tsx`.
- Low: a small test around `submitFormspree` success and failure. Auth and payment tests do not apply.

## 9. Monitoring

**Applies:** yes, and almost nothing is implemented. Structured request logs and queue/DB metrics do not apply without a server.

**In place:** `console.error` when the hero prefetch fails (`VideoScrollSequence.tsx`). No analytics, error tracker, or uptime check in the repo.

**Gaps**

- No Sentry (or equivalent), no JSON logs, no correlation id.
- No uptime check. There is no `/health`; the check target is `https://dreamhomebuildersnj.com/` (or `/`).
- No Core Web Vitals (LCP, CLS, INP). The hero video and the render-blocking Google Fonts stylesheet in `index.html` are the likely LCP costs.

**Fixes**

- High: an uptime probe on the production homepage (Azure monitor or any external pinger) with an alert on downtime.
- Medium: capture unhandled errors (Sentry or similar) and report LCP/CLS/INP.
- Low: skip pino/winston and request ids until a server exists.

## Priority summary

| Priority | Fix | Area |
|---|---|---|
| High | Do not buffer the 33MB hero into memory; ship a smaller / mobile encode and a modern poster | CDN, caching, scalability |
| High | Security headers in `public/staticwebapp.config.json` | Reliability & security |
| High | `Cache-Control: no-cache` on HTML | Caching |
| High | Uptime check on the live homepage | Monitoring |
| Medium | CI (`lint` + `build`) and dependency updates | Reliability & security |
| Medium | Form fetch timeout, honeypot, and an error boundary | Reliability & security |
| Medium | Error tracking and Core Web Vitals | Monitoring |
| Medium | Resize `logo-dhb.png` | CDN |
| Low | `.env.example` only if config leaves source | Architecture |
| Low | Queues, `/health`, migrations, rate limits — when a backend exists | Load balancing, database, queues, scalability |
