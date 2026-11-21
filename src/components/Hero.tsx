import {
  ArrowRight,
  FileSearch,
  Lock,
  GitCommitHorizontal,
  ShieldAlert,
  Activity,
  Wrench,
  Scale,
} from 'lucide-react';
import { InstantRepoScanner } from './InstantRepoScanner';

const DELIVERABLES = [
  {
    icon: GitCommitHorizontal,
    title: 'Commit-SHA-Pinned SBOM & SPDX Matrix',
    detail:
      'Complete direct and transitive dependency & SPDX license inventory parsed statically across package-lock.json, pnpm-lock.yaml, pyproject.toml, go.mod, and Cargo.toml.',
    meta: 'CycloneDX 1.5 + SPDX JSON',
  },
  {
    icon: ShieldAlert,
    title: 'Commercial License Blocker Detection',
    detail:
      'Flags viral copyleft (AGPL-3.0, GPL), source-available traps (SSPL, BSL, SUL), missing/ambiguous licenses (NOASSERTION), and proprietary /ee or /enterprise directory splits.',
    meta: 'Path-Level & Lockfile Audit',
  },
  {
    icon: Activity,
    title: 'OpenSSF Scorecard Health Summary',
    detail:
      'Supply-chain hygiene and maintenance risk breakdown across core upstream dependencies—surfacing abandoned forks, unpinned builds, and open critical CVEs.',
    meta: 'OpenSSF Scorecard v5',
  },
  {
    icon: Wrench,
    title: 'Actionable Remediation & Hour Estimates',
    detail:
      'Concrete engineering swap-out options using permissive (MIT / Apache-2.0 / BSD) drop-ins, architectural isolation paths, and realistic engineering hour ranges for deal pricing.',
    meta: 'Ready for LOI & Engineering',
  },
];

interface HeroProps {
  onRequestDeepAudit: (repoSlug?: string) => void;
}

export function Hero({ onRequestDeepAudit }: HeroProps) {
  return (
    <section
      id="scanner"
      className="relative scroll-mt-20 overflow-hidden border-b border-zinc-800/80 bg-zinc-950 bg-tech-grid"
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3.5 py-1.5 font-mono text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            <span className="text-emerald-300">100% FREE PUBLIC SCANNER</span>
            <span className="text-zinc-600">·</span>
            <span>NO SIGNUP · ZERO SERVER EXECUTION</span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-5xl sm:leading-[1.1]">
            Check Any GitHub Repo for AGPL, SUL &amp; License Traps in 2 Seconds.
          </h1>

          <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg">
            Paste any public GitHub repository to instantly verify commercial license safety,
            detect <code className="font-mono text-zinc-100">/ee</code> enterprise traps, and spot
            lockfiles—<strong className="font-semibold text-emerald-300">free forever</strong>{' '}
            directly in your browser. Buying or launching a private codebase? Upgrade to a{' '}
            <strong className="font-semibold text-white">
              72-hour Deep Private Repo &amp; M&amp;A Audit
            </strong>{' '}
            (Free Pilot for first 5 users · $1,200 standard thereafter).
          </p>
        </div>

        {/* Free Instant Client-Side Public Repo Scanner */}
        <InstantRepoScanner onRequestDeepAudit={onRequestDeepAudit} />

        {/* Secondary Actions & Trust Signals */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onRequestDeepAudit()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/25"
            >
              Claim Free Deep Audit Pilot (First 5)
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <a
              href="#sample-report"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/90 px-4 py-2.5 text-xs font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800"
            >
              <FileSearch className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              Inspect Interactive Deep Audit Sample
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[11px] text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              Mutual NDA for Private Repos
            </span>
            <span>Static read-only — zero code executed</span>
          </div>
        </div>

        {/* Deep Audit Deliverables Grid */}
        <div id="deliverables" className="mt-14 scroll-mt-24">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              What the 72-Hour Deep Private Repo &amp; M&amp;A Audit Unlocks
            </h2>
            <span className="hidden font-mono text-xs text-zinc-500 sm:inline">
              PDF Executive Brief + CycloneDX/SPDX JSON + 30-Min Handoff
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DELIVERABLES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex flex-col justify-between rounded-xl border border-zinc-800/90 bg-zinc-900/75 p-5 backdrop-blur-sm"
                >
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-950 text-emerald-400">
                      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-zinc-100">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">{item.detail}</p>
                  </div>
                  <div className="mt-4 border-t border-zinc-800/80 pt-3 font-mono text-[11px] text-emerald-300/90">
                    {item.meta}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explicit Scope Boundary Notice */}
        <div
          role="note"
          aria-label="Engineering Scope Boundary"
          className="mt-8 flex flex-col gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-4 sm:flex-row sm:items-start sm:p-5"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300">
            <Scale className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="text-xs leading-relaxed text-zinc-300 sm:text-sm">
            <span className="font-mono font-semibold uppercase tracking-wide text-amber-300">
              Scope Boundary:{' '}
            </span>
            Technical engineering fact-finding audit pinned to exact commit SHAs and file
            paths—designed to hand directly to your IP counsel or engineering team (not a formal
            legal opinion).
          </div>
        </div>
      </div>
    </section>
  );
}
