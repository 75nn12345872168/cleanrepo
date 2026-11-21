import { useState } from 'react';
import { ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { href: '#scanner', label: 'Free Scanner' },
  { href: '#comparison', label: 'Why CleanRepo' },
  { href: '#sample-report', label: 'Sample Deep Audit' },
  { href: '#process', label: 'Process' },
  { href: '#pricing', label: 'Deep Audit & Pricing' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <a
          href="#"
          className="flex items-center gap-2.5 rounded-md text-zinc-100 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-mono text-sm font-semibold tracking-tight text-zinc-100">
              CleanRepo
            </span>
            <span className="mt-0.5 text-[11px] text-zinc-400">
              Free OSS License Scanner &amp; M&amp;A Audits
            </span>
          </span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-400 transition hover:text-zinc-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#sample-report"
            className="rounded-lg border border-zinc-800 px-3.5 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
          >
            Sample Report
          </a>
          <a
            href="#intake"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            Deep Audit Pilot
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-800 p-2 text-zinc-300 hover:bg-zinc-900 hover:text-white md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="border-t border-zinc-800 bg-zinc-950 px-4 pb-4 pt-3 md:hidden"
        >
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#intake"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
            >
              Claim Free Deep Audit Pilot
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
