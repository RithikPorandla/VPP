## Cursor Cloud specific instructions

### Project overview

NB Connect is a civic intelligence platform MVP for New Bedford, MA. It is a purely front-end Next.js 14 application (no backend, no database, no external APIs). All data is mock/static. The app lives in the `mvp/` directory.

### Running the app

```bash
cd mvp
npm run dev
```

Dev server runs on port 3000 by default.

### Key pages

- `/` — Multilingual landing page (EN/PT/ES)
- `/screener` — 4-step benefits eligibility screener
- `/dashboard` — City intelligence analytics dashboard (mock data, Recharts)

### Lint / type checking

No ESLint config or lint script is defined. Use TypeScript compiler for type checking:

```bash
cd mvp && npx tsc --noEmit
```

### Build

```bash
cd mvp && npm run build
```

### Testing

No test framework or test scripts are configured. Manual testing via the browser is the primary verification method.

### Notable caveats

- The `package.json` is in `mvp/`, not the repo root. All npm commands must run from that directory.
- Tailwind CSS v4 is used (via `@tailwindcss/postcss`), not v3 — configuration is done through CSS imports rather than `tailwind.config.js`.
