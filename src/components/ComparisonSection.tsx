import { COMPARISON_ROWS } from '../data/sampleAudit';
import { CheckCircle2 } from 'lucide-react';

export function ComparisonSection() {
  return (
    <section
      id="comparison"
      className="scroll-mt-20 border-b border-zinc-800/80 bg-zinc-950 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Why CleanRepo Exists
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Free instant screening for public repos. 72-hour deep M&amp;A audits when deals are on
            the line.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Most sub-$10M acquisitions and pre-enterprise startups fall into a gap: raw open-source
            scanners miss source-available and <code className="font-mono text-zinc-200">/ee</code>{' '}
            traps, enterprise SCA tools lock you into five-figure annual contracts, and IP counsel
            bills hourly without parsing nested lockfiles.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/90 font-mono text-xs uppercase tracking-wider text-zinc-400">
                <th scope="col" className="px-5 py-4 font-semibold text-zinc-300">
                  Evaluation Factor
                </th>
                <th scope="col" className="px-5 py-4 font-semibold">
                  DIY / Raw CLI Tools
                </th>
                <th scope="col" className="px-5 py-4 font-semibold">
                  Enterprise SCA
                  <span className="mt-0.5 block font-sans text-[11px] font-normal normal-case text-zinc-500">
                    FOSSA / Black Duck
                  </span>
                </th>
                <th scope="col" className="px-5 py-4 font-semibold">
                  IP Law Firms
                </th>
                <th
                  scope="col"
                  className="border-l border-emerald-500/30 bg-emerald-500/[0.08] px-5 py-4 font-semibold text-emerald-300"
                >
                  CleanRepo
                  <span className="mt-0.5 block font-sans text-[11px] font-normal normal-case text-emerald-200/80">
                    Free Scanner + 72-Hr Deep Audit
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.criterion} className="transition hover:bg-zinc-900/50">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-5 py-4 font-medium text-zinc-100"
                  >
                    {row.criterion}
                  </th>
                  <td className="px-5 py-4 text-xs leading-relaxed text-zinc-400">{row.diy}</td>
                  <td className="px-5 py-4 text-xs leading-relaxed text-zinc-400">
                    {row.enterpriseSca}
                  </td>
                  <td className="px-5 py-4 text-xs leading-relaxed text-zinc-400">
                    {row.lawFirm}
                  </td>
                  <td className="border-l border-emerald-500/20 bg-emerald-500/[0.04] px-5 py-4 text-xs font-medium leading-relaxed text-zinc-100">
                    <span className="inline-flex items-start gap-2">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                        aria-hidden="true"
                      />
                      <span>{row.cleanrepo}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
