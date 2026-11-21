import { useEffect, useState, type FormEvent } from 'react';
import {
  Check,
  Copy,
  Mail,
  Send,
  ShieldCheck,
  Scale,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const CONTACT_EMAIL =
  (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim() || 'gibrel@cleanrepo.dev';
const FORM_ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined)?.trim() || '';
const WEB3FORMS_KEY = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined)?.trim() || '';

interface IntakeFormState {
  name: string;
  email: string;
  tier: string;
  role: string;
  ecosystem: string;
  timeline: string;
  notes: string;
}

const INITIAL_STATE: IntakeFormState = {
  name: '',
  email: '',
  tier: 'Free Deep Audit Pilot (First 5 Early-Access Users — Feedback/Testimonial Exchange)',
  role: 'Micro-PE Buyer (Acquire.com / Flippa)',
  ecosystem: 'Node.js / TypeScript',
  timeline: 'Active Diligence (2–4 weeks)',
  notes: '',
};

const DEEP_AUDIT_ITEMS = [
  '1 private or public repository / monorepo (up to 500K LOC)',
  'Full transitive SBOM across nested lockfiles (CycloneDX 1.5 & SPDX JSON)',
  'Deep AGPL / GPL / SSPL / BSL / SUL / NOASSERTION & /ee path exclusion audit',
  'OpenSSF Scorecard v5 maintenance & supply-chain health summary',
  'Engineering replacement cost & permissive drop-in hour estimates',
  'Mutual NDA + 30-minute walkthrough call delivered within 72 hours',
];

function buildIntakeSummary(data: IntakeFormState): string {
  return [
    'CleanRepo — 72-Hour Deep Private Repo & M&A Audit Request',
    '---------------------------------------------------------',
    `Selected Tier: ${data.tier}`,
    `Name: ${data.name}`,
    `Work Email: ${data.email}`,
    `Role: ${data.role}`,
    `Target Repo Ecosystem: ${data.ecosystem}`,
    `Deal Timeline: ${data.timeline}`,
    '',
    'Notes / Repository Context:',
    data.notes.trim() || '(None provided yet — will share after Mutual NDA)',
  ].join('\n');
}

interface PricingIntakeSectionProps {
  prefillRepo?: string;
}

export function PricingIntakeSection({ prefillRepo }: PricingIntakeSectionProps) {
  const [form, setForm] = useState<IntakeFormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [submitMode, setSubmitMode] = useState<'idle' | 'endpoint-sent' | 'fallback-ready'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!prefillRepo) return;
    setForm((prev) => {
      const prefix = `Target repository: ${prefillRepo}`;
      if (prev.notes.includes(prefillRepo)) return prev;
      return {
        ...prev,
        notes: prev.notes.trim() ? `${prefix}\n${prev.notes}` : `${prefix}\nNeed full transitive SBOM, license tree, and remediation hour estimate.`,
      };
    });
  }, [prefillRepo]);

  const summaryText = buildIntakeSummary(form);
  const mailtoHref = `mailto:${encodeURIComponent(CONTACT_EMAIL)}?subject=${encodeURIComponent(
    `[CleanRepo Deep Audit] ${form.role} — ${form.ecosystem}`
  )}&body=${encodeURIComponent(summaryText)}`;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg('Please enter your name and work email.');
      return;
    }

    if (!FORM_ENDPOINT) {
      setSubmitMode('fallback-ready');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, string> = {
        name: form.name,
        email: form.email,
        tier: form.tier,
        role: form.role,
        ecosystem: form.ecosystem,
        timeline: form.timeline,
        notes: form.notes,
        service: 'CleanRepo 72-Hour Deep Private Repo & M&A Audit',
      };
      if (WEB3FORMS_KEY) {
        payload.access_key = WEB3FORMS_KEY;
      }

      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Submission endpoint returned HTTP ${res.status}`);
      }
      setSubmitMode('endpoint-sent');
    } catch {
      setErrorMsg(
        'Direct form submission could not reach the configured endpoint. Use the one-click email or copy options below so your request is not lost.'
      );
      setSubmitMode('fallback-ready');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setErrorMsg('Clipboard access was blocked by the browser. Please use the mailto link.');
    }
  };

  return (
    <section
      id="pricing"
      className="scroll-mt-20 border-b border-zinc-800/80 bg-zinc-950 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Free Forever Public Tool + Deep M&amp;A Upgrade Path
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Start Free on Public Repos. Go Deep When Private Code or Capital Is at Stake.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Our browser-based public GitHub scanner is 100% free forever with zero signup. When you
            need transitive lockfile SBOMs, nested license trees, and M&amp;A remediation estimates
            under NDA, claim one of our 5 free early-access pilot slots or book our standard fixed
            M&amp;A rate.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {/* Pricing & Upgrade Ladder Column */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            {/* Tier 1: Free Forever Public Scanner */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Public Repo Instant Scanner
                </span>
                <span className="rounded-full border border-zinc-700 bg-zinc-950 px-2.5 py-0.5 font-mono text-[11px] text-emerald-300">
                  $0 · Free Forever
                </span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">
                No account, no rate-limit paywall on our side. Instant client-side GitHub API root
                license classification, <code className="font-mono text-zinc-200">/ee</code>{' '}
                directory check, lockfile detection, and X/LinkedIn shareable summaries.
              </p>
              <a
                href="#scanner"
                className="mt-3 inline-flex font-mono text-xs font-medium text-emerald-300 hover:text-emerald-200"
              >
                ↑ Jump to Free Scanner
              </a>
            </div>

            {/* Tier 2: Deep Private Repo & M&A Audit */}
            <div className="flex flex-1 flex-col justify-between rounded-2xl border border-emerald-500/35 bg-zinc-900/75 p-6 sm:p-7">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Deep Private Repo &amp; M&amp;A Audit
                  </span>
                  <span className="font-mono text-xs text-zinc-400">72-Hr Delivery</span>
                </div>

                <div className="mt-5 space-y-2.5">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] p-3.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-mono text-xs font-semibold uppercase text-emerald-300">
                        First 5 Early-Access Users
                      </span>
                      <span className="font-mono text-2xl font-bold text-white">$0 Pilot</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                      Full 72-hour Deep Audit Pilot at zero cost in exchange for structured product
                      feedback and an honest, verifiable testimonial upon delivery.
                    </p>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-3.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-mono text-xs font-semibold uppercase text-zinc-400">
                        Standard M&amp;A Rate Thereafter
                      </span>
                      <span className="font-mono text-xl font-bold text-zinc-100">$1,200</span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-zinc-400">
                      Fixed fee · 50% ($600) upon NDA &amp; SOW · 50% ($600) on 72-hr delivery.
                    </p>
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5 text-sm text-zinc-300">
                  {DEEP_AUDIT_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <ShieldCheck
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                        aria-hidden="true"
                      />
                      <span className="text-xs leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-3.5">
                <div className="flex items-start gap-2.5">
                  <Scale className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                  <p className="text-xs leading-relaxed text-zinc-300">
                    <strong className="font-mono text-amber-300">Scope Boundary:</strong> Technical
                    engineering fact-finding audit pinned to exact commit SHAs and file
                    paths—designed to hand directly to your IP counsel or engineering team (not a
                    formal legal opinion).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Intake Request Form */}
          <div
            id="intake"
            className="scroll-mt-24 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 lg:col-span-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Request a 72-Hour Deep Private Repo &amp; M&amp;A Audit
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Do not paste secrets or private tokens here. We send a Mutual NDA first.
                </p>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">
                Response within 1 business day
              </span>
            </div>

            {submitMode === 'endpoint-sent' ? (
              <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-200">
                      Deep Audit Request Received
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
                      Thank you, <span className="font-medium text-white">{form.name}</span>. Gibrel
                      Mohamed will reply to{' '}
                      <span className="font-mono text-emerald-200">{form.email}</span> with a
                      Mutual NDA and SOW within one business day.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setForm(INITIAL_STATE);
                        setSubmitMode('idle');
                      }}
                      className="mt-4 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="intake-tier"
                    className="block text-xs font-medium text-zinc-300"
                  >
                    Audit Tier
                  </label>
                  <select
                    id="intake-tier"
                    name="tier"
                    value={form.tier}
                    onChange={(e) => setForm({ ...form, tier: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-emerald-500/40 bg-zinc-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  >
                    <option>
                      Free Deep Audit Pilot (First 5 Early-Access Users — Feedback/Testimonial Exchange)
                    </option>
                    <option>Standard 72-Hour M&amp;A Deep Audit ($1,200 Fixed Fee)</option>
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="intake-name"
                      className="block text-xs font-medium text-zinc-300"
                    >
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="intake-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Alex Rivera"
                      className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="intake-email"
                      className="block text-xs font-medium text-zinc-300"
                    >
                      Work Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="intake-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alex@fund-or-company.com"
                      className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="intake-role"
                      className="block text-xs font-medium text-zinc-300"
                    >
                      Your Role
                    </label>
                    <select
                      id="intake-role"
                      name="role"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    >
                      <option>Micro-PE Buyer (Acquire.com / Flippa)</option>
                      <option>Seed / Series A CTO</option>
                      <option>M&amp;A Technical Advisor</option>
                      <option>Other / Engineering Leader</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="intake-ecosystem"
                      className="block text-xs font-medium text-zinc-300"
                    >
                      Target Repo Ecosystem
                    </label>
                    <select
                      id="intake-ecosystem"
                      name="ecosystem"
                      value={form.ecosystem}
                      onChange={(e) => setForm({ ...form, ecosystem: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    >
                      <option>Node.js / TypeScript</option>
                      <option>Python</option>
                      <option>Go</option>
                      <option>Rust</option>
                      <option>Multi-repo / Polyglot</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="intake-timeline"
                    className="block text-xs font-medium text-zinc-300"
                  >
                    Deal or Launch Timeline
                  </label>
                  <select
                    id="intake-timeline"
                    name="timeline"
                    value={form.timeline}
                    onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  >
                    <option>Urgent — Closing / LOI in &lt; 7 days</option>
                    <option>Active Diligence (2–4 weeks)</option>
                    <option>Pre-Launch / Enterprise Procurement</option>
                    <option>Exploratory / Upcoming Deal</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="intake-notes"
                    className="block text-xs font-medium text-zinc-300"
                  >
                    Context &amp; Scope Notes (Optional)
                  </label>
                  <textarea
                    id="intake-notes"
                    name="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Private repo count, hosted SaaS vs. distributed binary, or specific concerns (e.g., AGPL/n8n/forked dependencies)..."
                    className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {submitting
                    ? 'Submitting Deep Audit Request...'
                    : FORM_ENDPOINT
                      ? 'Submit Deep Audit Request'
                      : 'Prepare NDA & Deep Audit Intake Brief'}
                </button>

                {submitMode === 'fallback-ready' && (
                  <div className="mt-4 rounded-xl border border-emerald-500/30 bg-zinc-950 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-emerald-300">
                        Intake Brief Ready — Send via Email or Copy
                      </span>
                      <span className="font-mono text-[11px] text-zinc-500">
                        Zero-Backend Mode
                      </span>
                    </div>
                    <pre className="mt-3 max-h-40 overflow-auto rounded-lg border border-zinc-800 bg-zinc-900/90 p-3 font-mono text-[11px] leading-relaxed text-zinc-300">
                      {summaryText}
                    </pre>
                    <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
                      <a
                        href={mailtoHref}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-zinc-950 transition hover:bg-emerald-400"
                      >
                        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                        Open Pre-Filled Email ({CONTACT_EMAIL})
                      </a>
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                            Copied Brief
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                            Copy Brief
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
