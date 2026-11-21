import { useMemo, useState } from 'react';
import {
  Download,
  FileCode2,
  GitCommitHorizontal,
  FolderGit2,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Split,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  SAMPLE_AUDIT_META,
  SAMPLE_CYCLONEDX_SBOM,
  SAMPLE_FINDINGS,
  SAMPLE_SCORECARD_ROWS,
  type AuditFinding,
  type FindingFilter,
  type FindingSeverity,
} from '../data/sampleAudit';

type ReportTab = 'findings' | 'scorecard' | 'remediation';

const SEVERITY_STYLES: Record<
  FindingSeverity,
  { badge: string; border: string; icon: typeof ShieldAlert }
> = {
  BLOCKER: {
    badge: 'border-rose-500/40 bg-rose-500/15 text-rose-300',
    border: 'border-l-rose-500',
    icon: ShieldAlert,
  },
  RESTRICTED: {
    badge: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
    border: 'border-l-amber-500',
    icon: AlertTriangle,
  },
  'PATH EXCLUSION': {
    badge: 'border-sky-500/40 bg-sky-500/15 text-sky-300',
    border: 'border-l-sky-400',
    icon: Split,
  },
  CLEAR: {
    badge: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
    border: 'border-l-emerald-500',
    icon: CheckCircle2,
  },
};

function ScoreBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 10) * 100));
  const color =
    value >= 7.5 ? 'bg-emerald-400' : value >= 5 ? 'bg-amber-400' : 'bg-rose-400';

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-xs text-zinc-200">{value.toFixed(1)}</span>
    </div>
  );
}

function FindingCard({
  finding,
  expanded,
  onToggle,
}: {
  finding: AuditFinding;
  expanded: boolean;
  onToggle: () => void;
}) {
  const style = SEVERITY_STYLES[finding.severity];
  const Icon = style.icon;

  return (
    <article
      className={`rounded-xl border border-zinc-800 border-l-4 ${style.border} bg-zinc-950/90 transition hover:border-zinc-700`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${style.badge}`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {finding.severity}
              </span>
              <span className="font-mono text-xs text-zinc-500">{finding.id}</span>
              <h4 className="font-mono text-base font-semibold text-white">
                {finding.component}
                <span className="ml-1.5 text-xs font-normal text-zinc-400">
                  v{finding.version}
                </span>
              </h4>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1 text-zinc-300">
                <FolderGit2 className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                {finding.repoSlug}
              </span>
              <span className="inline-flex items-center gap-1">
                <GitCommitHorizontal className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                {finding.commitSha}
              </span>
              <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-zinc-200">
                SPDX: {finding.spdxId}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-start">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-right">
              <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Est. Remediation
              </div>
              <div className="font-mono text-xs font-semibold text-zinc-100">
                {finding.estimatedHours}
              </div>
            </div>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={expanded}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white"
            >
              {expanded ? (
                <>
                  Hide <ChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Details <ChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-zinc-300">{finding.summary}</p>

        {expanded && (
          <div className="mt-4 grid gap-3 border-t border-zinc-800/90 pt-4 text-xs sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-3.5">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Commercial / Distribution Risk
              </div>
              <p className="mt-1.5 leading-relaxed text-zinc-300">{finding.commercialImpact}</p>
              <div className="mt-3 font-mono text-[11px] text-zinc-400">
                <span className="text-zinc-500">Manifest: </span>
                <span className="text-zinc-200">{finding.manifestSource}</span>
              </div>
              <div className="mt-1 font-mono text-[11px] text-zinc-400">
                <span className="text-zinc-500">Evidence Paths: </span>
                <span className="text-emerald-300">{finding.licensePaths.join(', ')}</span>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-3.5">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                Engineering Remediation Path
              </div>
              <p className="mt-1.5 leading-relaxed text-zinc-300">{finding.remediationAction}</p>
              <div className="mt-3 font-mono text-[11px] text-zinc-400">
                <span className="text-zinc-500">Permissive Option: </span>
                <span className="text-zinc-100">{finding.permissiveAlternative}</span>
              </div>
              <div className="mt-1 inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                <Clock className="h-3 w-3 text-zinc-500" aria-hidden="true" />
                <span>Estimated Effort: {finding.estimatedHours}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export function SampleReportViewer() {
  const [activeTab, setActiveTab] = useState<ReportTab>('findings');
  const [filter, setFilter] = useState<FindingFilter>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'CR-F01': true,
    'CR-F02': true,
    'CR-F03': false,
    'CR-F04': false,
  });
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const filteredFindings = useMemo(() => {
    if (filter === 'all') return SAMPLE_FINDINGS;
    return SAMPLE_FINDINGS.filter((item) => item.filterGroup === filter);
  }, [filter]);

  const counts = useMemo(
    () => ({
      all: SAMPLE_FINDINGS.length,
      blockers: SAMPLE_FINDINGS.filter((f) => f.filterGroup === 'blockers').length,
      warnings: SAMPLE_FINDINGS.filter((f) => f.filterGroup === 'warnings').length,
      clear: SAMPLE_FINDINGS.filter((f) => f.filterGroup === 'clear').length,
    }),
    []
  );

  const handleToggleFinding = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownloadSbom = () => {
    const jsonString = JSON.stringify(SAMPLE_CYCLONEDX_SBOM, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cleanrepo-sample-sbom-cyclonedx-1.5.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section
      id="sample-report"
      className="scroll-mt-20 border-b border-zinc-800/80 bg-zinc-950 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Interactive Deep Audit Sample
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Inspect a Commit-SHA-Pinned CleanRepo Deep Audit Dossier
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              See what our 72-hour Deep Private Repo &amp; M&amp;A Audit delivers beyond the free
              root scanner: nested transitive lockfile findings (AGPL-3.0, n8n SUL, Activepieces
              MIT + <code className="font-mono text-zinc-200">/ee</code>, Umami MIT), OpenSSF
              Scorecard health, and a valid CycloneDX 1.5 JSON SBOM.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowJsonPreview((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
            >
              {showJsonPreview ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                  Hide JSON Snippet
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                  Preview SBOM JSON
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownloadSbom}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-zinc-950 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {downloaded ? 'Downloaded CycloneDX JSON' : 'Download Sample JSON SBOM'}
            </button>
          </div>
        </div>

        {/* Report Container Shell */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-2xl">
          {/* Metadata Header Bar */}
          <div className="border-b border-zinc-800 bg-zinc-900/95 p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-zinc-700 bg-zinc-950 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
                    {SAMPLE_AUDIT_META.reportId}
                  </span>
                  <span className="rounded border border-rose-500/40 bg-rose-500/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-rose-300">
                    GATE: {SAMPLE_AUDIT_META.overallGate}
                  </span>
                </div>
                <h3 className="mt-2 font-mono text-sm font-semibold text-white sm:text-base">
                  {SAMPLE_AUDIT_META.targetName}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-zinc-400">
                  <span>
                    SHA:{' '}
                    <span className="text-zinc-200">
                      {SAMPLE_AUDIT_META.rootCommitSha.slice(0, 12)}
                    </span>
                  </span>
                  <span>Packages: {SAMPLE_AUDIT_META.totalPackagesScanned}</span>
                  <span>Toolchain: {SAMPLE_AUDIT_META.staticToolchain}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                <div className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-center">
                  <div className="font-mono text-lg font-bold text-rose-300">
                    {counts.blockers}
                  </div>
                  <div className="font-mono text-[10px] uppercase text-rose-200/80">Blocker</div>
                </div>
                <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-center">
                  <div className="font-mono text-lg font-bold text-amber-300">
                    {counts.warnings}
                  </div>
                  <div className="font-mono text-[10px] uppercase text-amber-200/80">Warnings</div>
                </div>
                <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-center">
                  <div className="font-mono text-lg font-bold text-emerald-300">
                    {counts.clear}
                  </div>
                  <div className="font-mono text-[10px] uppercase text-emerald-200/80">Clear</div>
                </div>
              </div>
            </div>

            {/* Accessible Tab Bar */}
            <div
              role="tablist"
              aria-label="Sample audit sections"
              className="mt-5 flex flex-wrap gap-2 border-t border-zinc-800/80 pt-4"
            >
              {(
                [
                  { id: 'findings', label: `License & Path Findings (${SAMPLE_FINDINGS.length})` },
                  { id: 'scorecard', label: 'OpenSSF Scorecard & Health' },
                  { id: 'remediation', label: 'Remediation & Hour Estimates' },
                ] as const
              ).map((tab) => {
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={selected}
                    aria-controls={`panel-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                      selected
                        ? 'bg-zinc-100 text-zinc-950'
                        : 'border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Inline CycloneDX JSON Preview */}
          {showJsonPreview && (
            <div className="border-b border-zinc-800 bg-zinc-950 p-4 sm:p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-300">
                  <FileCode2 className="h-4 w-4" aria-hidden="true" />
                  cleanrepo-sample-sbom-cyclonedx-1.5.json
                </span>
                <span className="font-mono text-[11px] text-zinc-500">
                  Valid CycloneDX 1.5 JSON
                </span>
              </div>
              <pre className="max-h-72 overflow-auto rounded-lg border border-zinc-800 bg-zinc-900/90 p-3.5 font-mono text-[11px] leading-relaxed text-zinc-300">
                {JSON.stringify(SAMPLE_CYCLONEDX_SBOM, null, 2)}
              </pre>
            </div>
          )}

          {/* Panel 1: Findings */}
          {activeTab === 'findings' && (
            <div
              role="tabpanel"
              id="panel-findings"
              aria-labelledby="tab-findings"
              className="p-4 sm:p-6"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div
                  className="flex flex-wrap items-center gap-2"
                  role="group"
                  aria-label="Filter findings by severity"
                >
                  {(
                    [
                      { key: 'all', label: `All (${counts.all})` },
                      { key: 'blockers', label: `Blockers (${counts.blockers})` },
                      { key: 'warnings', label: `Warnings (${counts.warnings})` },
                      { key: 'clear', label: `Clear (${counts.clear})` },
                    ] as const
                  ).map((pill) => {
                    const active = filter === pill.key;
                    return (
                      <button
                        key={pill.key}
                        type="button"
                        onClick={() => setFilter(pill.key)}
                        aria-pressed={active}
                        className={`rounded-full px-3 py-1 font-mono text-xs transition ${
                          active
                            ? 'border border-emerald-500/50 bg-emerald-500/15 font-semibold text-emerald-300'
                            : 'border border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
                <div className="font-mono text-[11px] text-zinc-500">
                  Manifests parsed: {SAMPLE_AUDIT_META.manifestsScanned.join(' · ')}
                </div>
              </div>

              <div className="space-y-3.5">
                {filteredFindings.map((finding) => (
                  <FindingCard
                    key={finding.id}
                    finding={finding}
                    expanded={Boolean(expandedIds[finding.id])}
                    onToggle={() => handleToggleFinding(finding.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Panel 2: OpenSSF Scorecard */}
          {activeTab === 'scorecard' && (
            <div
              role="tabpanel"
              id="panel-scorecard"
              aria-labelledby="tab-scorecard"
              className="p-4 sm:p-6"
            >
              <div className="mb-4 text-xs text-zinc-400">
                OpenSSF Scorecard v5 supply-chain checks evaluated via static metadata API at exact
                pinned commit SHAs (scores on a 0–10 scale).
              </div>
              <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950">
                <table className="w-full min-w-[680px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/80 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                      <th className="px-4 py-3">Component / SHA</th>
                      <th className="px-4 py-3">Aggregate</th>
                      <th className="px-4 py-3">Maintained</th>
                      <th className="px-4 py-3">CI-Tests</th>
                      <th className="px-4 py-3">Vulnerabilities</th>
                      <th className="px-4 py-3">Pinned-Deps</th>
                      <th className="px-4 py-3">Engineering Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {SAMPLE_SCORECARD_ROWS.map((row) => (
                      <tr key={row.component} className="hover:bg-zinc-900/40">
                        <td className="px-4 py-3.5 font-mono">
                          <div className="font-semibold text-white">{row.component}</div>
                          <div className="text-[11px] text-zinc-500">@{row.commitSha}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <ScoreBar value={row.aggregate} />
                        </td>
                        <td className="px-4 py-3.5 font-mono text-zinc-200">
                          {row.maintained}/10
                        </td>
                        <td className="px-4 py-3.5 font-mono text-zinc-200">{row.ciTests}/10</td>
                        <td className="px-4 py-3.5 font-mono text-zinc-200">
                          {row.vulnerabilities}/10
                        </td>
                        <td className="px-4 py-3.5 font-mono text-zinc-200">
                          {row.pinnedDeps}/10
                        </td>
                        <td className="px-4 py-3.5 leading-relaxed text-zinc-400">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Panel 3: Remediation Plan */}
          {activeTab === 'remediation' && (
            <div
              role="tabpanel"
              id="panel-remediation"
              aria-labelledby="tab-remediation"
              className="p-4 sm:p-6"
            >
              <div className="mb-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    Total Remediation Estimate
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-white">
                    {SAMPLE_AUDIT_META.totalRemediationHours}
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">
                    1 senior full-stack engineer (~1–1.5 sprints)
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    Components Needing Action
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-amber-300">
                    3 of 4 flagged
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">
                    1 hard AGPL blocker · 2 commercial/path guards
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    Deal / LOI Leverage
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-emerald-300">
                    Escrow / Pre-Close
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">
                    Quantifies exact fix scope before closing funds
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {SAMPLE_FINDINGS.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-white">
                          {item.component}
                        </span>
                        <span className="font-mono text-[11px] text-zinc-500">
                          ({item.spdxId})
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                        <strong className="text-zinc-100">Drop-in / Action: </strong>
                        {item.permissiveAlternative}
                      </p>
                    </div>
                    <div className="shrink-0 font-mono text-xs font-semibold text-emerald-300">
                      {item.estimatedHours}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
