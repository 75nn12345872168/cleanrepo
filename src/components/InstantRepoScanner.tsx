import { useState, type FormEvent } from 'react';
import {
  Search,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  AlertCircle,
  FileCode2,
  ArrowRight,
  Lock,
  FileWarning,
} from 'lucide-react';
import {
  buildShareableText,
  scanPublicGitHubRepo,
  type LiveScanResult,
  type ScanError,
  type ScanStatus,
} from '../lib/githubScanner';

const EXAMPLE_REPOS = [
  { label: 'umami-software/umami', hint: 'MIT' },
  { label: 'documenso/documenso', hint: 'AGPL-3.0' },
  { label: 'n8n-io/n8n', hint: 'SUL' },
  { label: 'activepieces/activepieces', hint: 'MIT + /ee' },
];

const STATUS_UI: Record<
  ScanStatus,
  {
    container: string;
    badge: string;
    icon: typeof CheckCircle2;
    accentText: string;
  }
> = {
  green: {
    container: 'border-emerald-500/35 bg-emerald-500/[0.06]',
    badge: 'border-emerald-500/40 bg-emerald-500/20 text-emerald-200',
    icon: CheckCircle2,
    accentText: 'text-emerald-300',
  },
  red: {
    container: 'border-rose-500/40 bg-rose-500/[0.07]',
    badge: 'border-rose-500/45 bg-rose-500/20 text-rose-200',
    icon: ShieldAlert,
    accentText: 'text-rose-300',
  },
  amber: {
    container: 'border-amber-500/40 bg-amber-500/[0.07]',
    badge: 'border-amber-500/45 bg-amber-500/20 text-amber-200',
    icon: AlertTriangle,
    accentText: 'text-amber-300',
  },
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface InstantRepoScannerProps {
  onRequestDeepAudit: (repoSlug?: string) => void;
}

export function InstantRepoScanner({ onRequestDeepAudit }: InstantRepoScannerProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LiveScanResult | null>(null);
  const [error, setError] = useState<ScanError | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const runScan = async (target: string) => {
    setInput(target);
    setLoading(true);
    setError(null);
    setCopiedShare(false);

    const outcome = await scanPublicGitHubRepo(target);
    setLoading(false);

    if (outcome.ok) {
      setResult(outcome.data);
    } else {
      setResult(null);
      setError(outcome.error);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void runScan(input);
  };

  const handleCopyShare = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(buildShareableText(result));
      setCopiedShare(true);
      window.setTimeout(() => setCopiedShare(false), 2600);
    } catch {
      // Fallback ignored cleanly if clipboard permissions are blocked
    }
  };

  const ui = result ? STATUS_UI[result.status] : null;
  const StatusIcon = ui?.icon ?? CheckCircle2;

  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-200">
            Free Instant Public Repo Scanner
          </span>
        </div>
        <span className="font-mono text-[11px] text-zinc-400">
          100% Browser-Side · GitHub REST API · No Signup Required
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor="repo-scan-input" className="sr-only">
          Public GitHub Repository URL or owner/repo
        </label>
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          />
          <input
            id="repo-scan-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://github.com/umami-software/umami or owner/repo"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-10 pr-4 font-mono text-sm text-white placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/25"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Scanning...
            </>
          ) : (
            <>Scan Repo Free</>
          )}
        </button>
      </form>

      {/* One-Click Live Examples */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono text-[11px] text-zinc-500">Try live:</span>
        {EXAMPLE_REPOS.map((example) => (
          <button
            key={example.label}
            type="button"
            disabled={loading}
            onClick={() => void runScan(example.label)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/90 px-2.5 py-1 font-mono text-[11px] text-zinc-300 transition hover:border-zinc-600 hover:text-white disabled:opacity-50"
          >
            <span>{example.label}</span>
            <span className="text-zinc-500">({example.hint})</span>
          </button>
        ))}
      </div>

      {/* Error / Rate-Limit State */}
      {error && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/[0.07] p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-2.5">
              <AlertCircle
                className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-300"
                aria-hidden="true"
              />
              <div className="text-xs leading-relaxed text-zinc-200 sm:text-sm">
                <div className="font-mono text-xs font-semibold uppercase tracking-wide text-amber-300">
                  {error.kind === 'rate_limited'
                    ? 'GitHub API Rate Limit Reached'
                    : error.kind === 'not_found'
                      ? 'Repository Not Found or Private'
                      : 'Scan Could Not Complete'}
                </div>
                <p className="mt-1 text-zinc-300">{error.message}</p>
              </div>
            </div>

            {error.kind === 'not_found' && (
              <button
                type="button"
                onClick={() => onRequestDeepAudit(error.candidateSlug)}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-emerald-400"
              >
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                Audit Private Repo
              </button>
            )}
          </div>
        </div>
      )}

      {/* Live Scan Result Card */}
      {result && ui && (
        <div className={`mt-5 rounded-xl border p-4 sm:p-5 ${ui.container}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-semibold ${ui.badge}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {result.badgeLabel}
                </span>
                <span className="rounded-md border border-zinc-700/80 bg-zinc-950/90 px-2 py-0.5 font-mono text-xs text-zinc-200">
                  SPDX: {result.spdxId}
                </span>
                {result.hasEnterpriseDir && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-rose-500/40 bg-rose-500/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-rose-200">
                    <FileWarning className="h-3 w-3" aria-hidden="true" />
                    /ee Path Flag
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a
                  href={result.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-base font-bold text-white hover:text-emerald-300"
                >
                  {result.fullName}
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                </a>
                {result.language && (
                  <span className="rounded bg-zinc-950/80 px-2 py-0.5 font-mono text-[11px] text-zinc-400 border border-zinc-800">
                    {result.language}
                  </span>
                )}
              </div>

              {result.description && (
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">{result.description}</p>
              )}
              <p className={`mt-2 text-xs font-medium leading-relaxed ${ui.accentText}`}>
                {result.headlineReason}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void handleCopyShare()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900"
              >
                {copiedShare ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    Copied for X / LinkedIn
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    Copy Shareable Result
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Repo Stats Grid */}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-800/90 bg-zinc-950/85 p-3">
              <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                Last Push Date
              </div>
              <div className="mt-1 font-mono text-sm font-semibold text-zinc-100">
                {formatDate(result.pushedAt)}
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-zinc-500">
                Branch: {result.defaultBranch}
                {result.archived ? ' · ARCHIVED' : ''}
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800/90 bg-zinc-950/85 p-3">
              <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Open Issues
              </div>
              <div className="mt-1 font-mono text-sm font-semibold text-zinc-100">
                {result.openIssuesCount.toLocaleString()}
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-zinc-500">
                Root LICENSE: {result.hasLicenseFile ? 'Present' : 'Missing'}
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800/90 bg-zinc-950/85 p-3">
              <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                <FileCode2 className="h-3.5 w-3.5" aria-hidden="true" />
                Detected Lockfiles
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {result.detectedLockfiles.length > 0 ? (
                  result.detectedLockfiles.slice(0, 4).map((lf) => (
                    <span
                      key={lf}
                      className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[11px] text-emerald-300"
                    >
                      {lf}
                    </span>
                  ))
                ) : (
                  <span className="font-mono text-xs text-zinc-400">None at root</span>
                )}
              </div>
            </div>
          </div>

          {/* Findings / Flags */}
          <ul className="mt-4 space-y-1.5 border-t border-zinc-800/80 pt-3.5 text-xs text-zinc-300">
            {result.flags.map((flag) => (
              <li key={flag} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                <span className="leading-relaxed">{flag}</span>
              </li>
            ))}
          </ul>

          {/* Deep Audit Upgrade Path Directly Below Result */}
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950/95 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs leading-relaxed text-zinc-300">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                Need Transitive Lockfile SBOM &amp; M&amp;A Sign-Off?
              </div>
              <p className="mt-1 text-zinc-400">
                Instant scans inspect root metadata only. Upgrade to a{' '}
                <strong className="text-zinc-100">72-Hour Deep Private Repo &amp; M&amp;A Audit</strong>{' '}
                for full nested lockfile SBOMs, OpenSSF Scorecard, and drop-in replacement hour
                estimates. <strong className="text-emerald-300">First 5 early-access users: Free Pilot</strong>{' '}
                (feedback exchange) · $1,200 standard thereafter.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRequestDeepAudit(result.fullName)}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-zinc-950 transition hover:bg-emerald-400"
            >
              Deep Audit This Repo
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          {result.rateLimitRemaining !== null && (
            <div className="mt-2.5 flex items-center justify-end font-mono text-[10px] text-zinc-500">
              GitHub Browser API Remaining: {result.rateLimitRemaining} reqs this hour
            </div>
          )}
        </div>
      )}
    </div>
  );
}
