import { FileSignature, Terminal, GitPullRequestDraft, FileCheck2, Shield } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: FileSignature,
    title: 'Mutual NDA & Read-Only Repo Access',
    timing: 'Hour 0',
    description:
      'We countersign a mutual NDA and fixed-scope SOW. You grant a fine-grained read-only GitHub/GitLab PAT (or deliver a commit-pinned zip archive)—never write access, never production credentials.',
  },
  {
    step: '02',
    icon: Terminal,
    title: 'Static SBOM & License Extraction',
    timing: 'Hours 1–24',
    description:
      'We statically parse lockfiles (package-lock.json, pnpm-lock.yaml, pyproject.toml, go.mod, Cargo.toml) using Licensee, Syft, and OpenSSF Scorecard v5—flagging copyleft, SUL/SSPL/BSL, NOASSERTION, and /ee splits.',
  },
  {
    step: '03',
    icon: GitPullRequestDraft,
    title: 'Engineering Remediation Mapping',
    timing: 'Hours 24–56',
    description:
      'A Principal Software Engineer verifies every flagged file path by hand, eliminates scanner false positives, and maps permissive (MIT / Apache-2.0 / BSD) replacements with concrete engineering hour ranges.',
  },
  {
    step: '04',
    icon: FileCheck2,
    title: 'PDF + JSON Report Delivery within 72 Hours',
    timing: '≤ Hour 72',
    description:
      'You receive the commit-SHA-pinned Executive PDF Brief (structured for M&A buyers & IP counsel), the machine-readable CycloneDX/SPDX JSON SBOM, and a 30-minute walkthrough call.',
  },
];

export function ProcessSection() {
  return (
    <section
      id="process"
      className="scroll-mt-20 border-b border-zinc-800/80 bg-zinc-950 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
            How It Works &amp; Security Protocol
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Four deterministic steps. Zero client code execution.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Designed around M&amp;A confidentiality and zero-trust repository handling. Your target
            codebase is never installed, compiled, or executed on third-party servers.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-emerald-400">
                    STEP {item.step}
                  </span>
                  <span className="rounded border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                    {item.timing}
                  </span>
                </div>
                <div className="mt-4 flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-950 text-zinc-200">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Security Protocol Strip */}
        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <Shield className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Zero-Execution Static Security Protocol
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                  All repository archives are inspected statically in an ephemeral isolated
                  environment with no outbound network access during parsing, no package-manager
                  lifecycle scripts executed, and verified deletion of local clones within 7 days
                  of report acceptance.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 font-mono text-[11px] text-zinc-300">
              <span className="rounded border border-zinc-700 bg-zinc-950 px-2.5 py-1">
                Read-Only PAT
              </span>
              <span className="rounded border border-zinc-700 bg-zinc-950 px-2.5 py-1">
                No LLM Code Upload
              </span>
              <span className="rounded border border-zinc-700 bg-zinc-950 px-2.5 py-1">
                7-Day Purge
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
