# CleanRepo — Free Public GitHub License Scanner & 72-Hour Deep M&A Audits

100% static, zero-backend React + TypeScript + Tailwind CSS v4 web application built with Vite.

- **Free Forever Public Scanner:** Runs entirely in the user's browser against the public GitHub REST API (`api.github.com/repos/{owner}/{repo}` and `/contents`) to classify commercial license safety (`GREEN` / `RED BLOCKER` / `AMBER WARNING`), detect `/ee` & `/enterprise` path traps, identify lockfiles, and generate shareable summaries.
- **Deep Private Repo & M&A Audit Upgrade Path:** Full transitive SBOM, nested dependency license tree, OpenSSF Scorecard, and engineering replacement cost estimate delivered in 72 hours (First 5 early-access users: Free Deep Audit Pilot in exchange for structured feedback/testimonial; $1,200 standard M&A rate thereafter).

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Intake Form Configuration (Optional)

By default, the deep audit intake form works with **zero backend configuration** by generating a structured brief with one-click `mailto:` and clipboard copy actions. To enable direct POST submission via Formspree or Web3Forms, set `VITE_FORM_ENDPOINT` (see `.env.example`).

## Deploy to Vercel

1. Push to GitHub and import into [vercel.com/new](https://vercel.com/new) (set **Root Directory** if deploying from a monorepo).
2. Framework Preset: **Vite** (`npm run build`, Output Directory: `dist`).
3. Optional: add `VITE_CONTACT_EMAIL` and `VITE_FORM_ENDPOINT` in Vercel Environment Variables.
4. Click **Deploy**.
