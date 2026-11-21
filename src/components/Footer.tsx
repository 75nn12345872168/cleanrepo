import { ShieldCheck, Mail, Lock } from 'lucide-react';

const CONTACT_EMAIL =
  (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim() || 'gibrel@cleanrepo.dev';

export function Footer() {
  return (
    <footer className="bg-zinc-950 py-12 text-zinc-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b border-zinc-800/80 pb-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 text-zinc-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <span className="font-mono text-sm font-semibold text-white">CleanRepo</span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-zinc-400">
              Free-forever public GitHub license scanner &amp; 72-hour Pre-Acquisition OSS License
              &amp; Supply-Chain Deep Audits for Micro-PE buyers, M&amp;A advisors, and Seed/Series
              A CTOs.
            </p>
            <div className="mt-4 space-y-1.5 text-xs">
              <div className="font-medium text-zinc-200">
                Principal Engineer: <span className="text-white">Gibrel Mohamed</span>
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-1.5 font-mono text-emerald-300 hover:text-emerald-200"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Confidentiality
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">
              <Lock className="mr-1 inline h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              Public scans run 100% inside your browser against GitHub&apos;s public REST API. For
              private Deep Audits, a mutual NDA is executed before repo access and local static
              clones are purged within 7 days of delivery.
            </p>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Engineering Scope Disclaimer
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">
              CleanRepo delivers a technical engineering fact-finding audit pinned to exact commit
              SHAs and file paths—designed to hand directly to your IP counsel or engineering team.
              CleanRepo is not a law firm and does not provide legal advice, formal legal opinions,
              or legal indemnification.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <span className="font-mono">© {new Date().getFullYear()} CleanRepo · Gibrel Mohamed</span>
          <span className="font-mono text-[11px]">
            100% Client-Side Public Scanner · CycloneDX 1.5 / SPDX · OpenSSF Scorecard v5
          </span>
        </div>
      </div>
    </footer>
  );
}
