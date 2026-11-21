export type ScanStatus = 'green' | 'red' | 'amber';

export interface LiveScanResult {
  owner: string;
  repo: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  defaultBranch: string;
  language: string | null;
  pushedAt: string;
  openIssuesCount: number;
  stargazersCount: number;
  archived: boolean;
  spdxId: string;
  licenseName: string;
  status: ScanStatus;
  badgeLabel: string;
  headlineReason: string;
  flags: string[];
  detectedLockfiles: string[];
  hasEnterpriseDir: boolean;
  enterprisePaths: string[];
  hasLicenseFile: boolean;
  rateLimitRemaining: number | null;
  rateLimitResetIso: string | null;
  scannedAtIso: string;
}

export interface ScanError {
  kind: 'invalid_input' | 'not_found' | 'rate_limited' | 'network';
  message: string;
  resetTimeLabel?: string;
  candidateSlug?: string;
}

const GREEN_SPDX = new Set([
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'ISC',
]);

const RED_SPDX = new Set([
  'AGPL-3.0',
  'AGPL-3.0-only',
  'AGPL-3.0-or-later',
  'GPL-2.0',
  'GPL-2.0-only',
  'GPL-2.0-or-later',
  'GPL-3.0',
  'GPL-3.0-only',
  'GPL-3.0-or-later',
  'SSPL-1.0',
  'BSL-1.0',
  'BSL-1.1',
  'BUSL-1.1',
]);

const KNOWN_LOCKFILES = new Set([
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'bun.lockb',
  'bun.lock',
  'pyproject.toml',
  'poetry.lock',
  'uv.lock',
  'requirements.txt',
  'go.mod',
  'go.sum',
  'Cargo.toml',
  'Cargo.lock',
  'Gemfile.lock',
  'composer.lock',
  'pom.xml',
  'build.gradle',
  'build.gradle.kts',
]);

const ENTERPRISE_ROOT_DIRS = new Set(['ee', 'enterprise', 'enterprise-edition']);

export function parseGitHubRepoInput(raw: string): { owner: string; repo: string } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let cleaned = trimmed
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/^github\.com\//i, '')
    .split(/[?#]/)[0]
    .replace(/\/+$/, '');

  const segments = cleaned.split('/').filter(Boolean);
  if (segments.length < 2) return null;

  const owner = segments[0];
  const repo = segments[1].replace(/\.git$/i, '');

  const validSegment = /^[A-Za-z0-9._-]+$/;
  if (!validSegment.test(owner) || !validSegment.test(repo)) return null;

  return { owner, repo };
}

interface GitHubRepoApiResponse {
  full_name: string;
  html_url: string;
  description: string | null;
  default_branch: string;
  language: string | null;
  pushed_at: string;
  open_issues_count: number;
  stargazers_count: number;
  archived: boolean;
  license: {
    key?: string;
    name?: string;
    spdx_id?: string;
  } | null;
}

interface GitHubContentEntry {
  name: string;
  path: string;
  type: 'file' | 'dir' | 'symlink' | 'submodule';
  download_url: string | null;
}

function formatResetTime(resetHeader: string | null): string | undefined {
  if (!resetHeader) return undefined;
  const epochSeconds = Number(resetHeader);
  if (!Number.isFinite(epochSeconds) || epochSeconds <= 0) return undefined;
  const date = new Date(epochSeconds * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function fetchRawLicenseSnippet(downloadUrl: string | null): Promise<string> {
  if (!downloadUrl) return '';
  try {
    const res = await fetch(downloadUrl);
    if (!res.ok) return '';
    const text = await res.text();
    return text.slice(0, 3500);
  } catch {
    return '';
  }
}

export async function scanPublicGitHubRepo(
  rawInput: string
): Promise<{ ok: true; data: LiveScanResult } | { ok: false; error: ScanError }> {
  const parsed = parseGitHubRepoInput(rawInput);
  if (!parsed) {
    return {
      ok: false,
      error: {
        kind: 'invalid_input',
        message:
          'Enter a valid public GitHub repository URL or owner/repo slug (for example: umami-software/umami).',
      },
    };
  }

  const { owner, repo } = parsed;
  const apiHeaders: HeadersInit = {
    Accept: 'application/vnd.github+json',
  };

  let repoRes: Response;
  let contentsRes: Response;
  try {
    [repoRes, contentsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
        headers: apiHeaders,
      }),
      fetch(
        `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents`,
        { headers: apiHeaders }
      ),
    ]);
  } catch {
    return {
      ok: false,
      error: {
        kind: 'network',
        message:
          'Could not reach GitHub API from your browser. Check your connection or try again in a moment.',
      },
    };
  }

  const remainingHeader = repoRes.headers.get('x-ratelimit-remaining');
  const resetHeader = repoRes.headers.get('x-ratelimit-reset');
  const rateLimitRemaining =
    remainingHeader !== null && !Number.isNaN(Number(remainingHeader))
      ? Number(remainingHeader)
      : null;

  if (repoRes.status === 403 || repoRes.status === 429) {
    const resetTimeLabel = formatResetTime(resetHeader);
    return {
      ok: false,
      error: {
        kind: 'rate_limited',
        resetTimeLabel,
        message: resetTimeLabel
          ? `GitHub's unauthenticated browser API limit (60 requests/hour per IP) was reached. Quota resets around ${resetTimeLabel}.`
          : "GitHub's unauthenticated browser API limit (60 requests/hour per IP) was reached. Please retry after reset or inspect the sample audit below.",
      },
    };
  }

  if (repoRes.status === 404) {
    return {
      ok: false,
      error: {
        kind: 'not_found',
        candidateSlug: `${owner}/${repo}`,
        message: `Repository "${owner}/${repo}" was not found publicly. If this is a private acquisition target, request a confidential 72-hour Deep Audit below.`,
      },
    };
  }

  if (!repoRes.ok) {
    return {
      ok: false,
      error: {
        kind: 'network',
        message: `GitHub API returned HTTP ${repoRes.status}. Please verify the repository path and try again.`,
      },
    };
  }

  const repoJson = (await repoRes.json()) as GitHubRepoApiResponse;
  const contentsJson: GitHubContentEntry[] = contentsRes.ok
    ? ((await contentsRes.json()) as GitHubContentEntry[])
    : [];
  const entries = Array.isArray(contentsJson) ? contentsJson : [];

  const detectedLockfiles = entries
    .filter((entry) => entry.type === 'file' && KNOWN_LOCKFILES.has(entry.name))
    .map((entry) => entry.name)
    .sort();

  const enterprisePaths = entries
    .filter(
      (entry) => entry.type === 'dir' && ENTERPRISE_ROOT_DIRS.has(entry.name.toLowerCase())
    )
    .map((entry) => `/${entry.path}`);

  const licenseFile = entries.find(
    (entry) =>
      entry.type === 'file' &&
      (/^(license|copying)(\.[a-z0-9]+)?$/i.test(entry.name))
  );

  const hasLicenseFile = Boolean(licenseFile);
  const rawSpdx = repoJson.license?.spdx_id?.trim() || 'NONE';
  const licenseName = repoJson.license?.name?.trim() || 'No license detected';

  // Fetch raw LICENSE text (0 GitHub REST rate-limit cost) when license is NOASSERTION or custom
  // so source-available licenses (SUL, SSPL, BSL) and /ee carve-outs are surfaced accurately.
  let licenseTextSnippet = '';
  if (licenseFile && (rawSpdx === 'NOASSERTION' || rawSpdx === 'NONE')) {
    licenseTextSnippet = await fetchRawLicenseSnippet(licenseFile.download_url);
  }
  const lowerLicenseText = licenseTextSnippet.toLowerCase();

  const detectedRestrictedTerms: string[] = [];
  if (lowerLicenseText.includes('sustainable use license')) {
    detectedRestrictedTerms.push('Sustainable Use License (SUL)');
  }
  if (
    lowerLicenseText.includes('server side public license') ||
    /\bsspl\b/i.test(licenseTextSnippet)
  ) {
    detectedRestrictedTerms.push('SSPL (Server Side Public License)');
  }
  if (
    lowerLicenseText.includes('business source license') ||
    /\bbsl\b/i.test(licenseTextSnippet)
  ) {
    detectedRestrictedTerms.push('BSL (Business Source License)');
  }
  if (
    lowerLicenseText.includes('proprietary') ||
    (lowerLicenseText.includes('all rights reserved') &&
      !lowerLicenseText.includes('permission is hereby granted'))
  ) {
    detectedRestrictedTerms.push('Proprietary / All Rights Reserved terms');
  }

  const mentionsEeSplitInLicense =
    /(packages\/ee\/|\/ee\/|\.ee\.|enterprise edition)/i.test(licenseTextSnippet);

  const allEnterpriseFlags = [...enterprisePaths];
  if (mentionsEeSplitInLicense && allEnterpriseFlags.length === 0) {
    allEnterpriseFlags.push('LICENSE references proprietary /ee or .ee. paths');
  }

  const hasEnterpriseDir = enterprisePaths.length > 0 || mentionsEeSplitInLicense;

  // Deterministic classification matching CleanRepo policy
  const flags: string[] = [];
  let status: ScanStatus;
  let badgeLabel: string;
  let headlineReason: string;

  const isRedSpdx = RED_SPDX.has(rawSpdx);
  const isGreenSpdx = GREEN_SPDX.has(rawSpdx);

  if (isRedSpdx || hasEnterpriseDir || detectedRestrictedTerms.length > 0) {
    status = 'red';
    badgeLabel = 'RED BLOCKER · Viral Copyleft / Restricted';

    if (isRedSpdx) {
      flags.push(
        `Root SPDX "${rawSpdx}" carries viral copyleft or commercial distribution restrictions.`
      );
    }
    for (const term of detectedRestrictedTerms) {
      flags.push(`LICENSE file text matches restricted commercial terms: ${term}.`);
    }
    if (enterprisePaths.length > 0) {
      flags.push(
        `Root directory contains ${enterprisePaths.join(', ')} — requires path-level proprietary license exclusion check.`
      );
    } else if (mentionsEeSplitInLicense) {
      flags.push(
        'Root LICENSE explicitly carves out proprietary /ee or .ee. files under separate commercial terms.'
      );
    }

    headlineReason = isRedSpdx
      ? `Flagged under ${rawSpdx} — commercial SaaS or redistribution requires legal/engineering remediation.`
      : detectedRestrictedTerms.length > 0
        ? `Restricted source-available or proprietary terms detected (${detectedRestrictedTerms[0]}).`
        : `Proprietary enterprise directory split (${allEnterpriseFlags[0]}) detected at root.`;
  } else if (!hasLicenseFile || rawSpdx === 'NOASSERTION' || rawSpdx === 'NONE') {
    status = 'amber';
    badgeLabel = 'AMBER WARNING · Uncertain License';
    if (!hasLicenseFile) {
      flags.push('No root LICENSE or COPYING file found (default copyright = all rights reserved).');
    } else {
      flags.push(
        'GitHub returned NOASSERTION — custom, dual, or modified license text requires manual inspection.'
      );
    }
    headlineReason =
      'Commercial reuse rights cannot be verified automatically; inspect raw LICENSE text and lockfile dependencies before integrating.';
  } else if (isGreenSpdx) {
    status = 'green';
    badgeLabel = 'GREEN · Commercial Safe (Root Verified)';
    flags.push(
      `Root license verified as permissive ${rawSpdx} with no root /ee or /enterprise folder detected.`
    );
    flags.push(
      'Note: Instant scan checks root metadata only — run a Deep Audit to verify nested transitive lockfile dependencies.'
    );
    headlineReason = `Root repository uses permissive ${rawSpdx}. Verify transitive dependencies before M&A close or enterprise launch.`;
  } else {
    status = 'amber';
    badgeLabel = 'AMBER WARNING · Non-Standard / Review Required';
    flags.push(
      `Detected SPDX "${rawSpdx}" (${licenseName}) is outside the unconditional MIT/Apache-2.0/BSD/ISC allowlist.`
    );
    flags.push(
      'Weak-copyleft or specialty licenses (e.g., MPL-2.0, LGPL, EPL) require linking/modification boundary verification.'
    );
    headlineReason = `Detected ${rawSpdx} — verify linking, modification, and attribution rules before commercial bundling.`;
  }

  if (repoJson.archived) {
    flags.push('Repository is archived (read-only / unmaintained upstream).');
  }

  const rateLimitResetIso =
    resetHeader && Number.isFinite(Number(resetHeader))
      ? new Date(Number(resetHeader) * 1000).toISOString()
      : null;

  return {
    ok: true,
    data: {
      owner,
      repo,
      fullName: repoJson.full_name,
      htmlUrl: repoJson.html_url,
      description: repoJson.description,
      defaultBranch: repoJson.default_branch,
      language: repoJson.language,
      pushedAt: repoJson.pushed_at,
      openIssuesCount: repoJson.open_issues_count,
      stargazersCount: repoJson.stargazers_count,
      archived: repoJson.archived,
      spdxId: rawSpdx,
      licenseName,
      status,
      badgeLabel,
      headlineReason,
      flags,
      detectedLockfiles,
      hasEnterpriseDir,
      enterprisePaths: allEnterpriseFlags,
      hasLicenseFile,
      rateLimitRemaining,
      rateLimitResetIso,
      scannedAtIso: new Date().toISOString(),
    },
  };
}

export function buildShareableText(result: LiveScanResult): string {
  const verdict =
    result.status === 'green'
      ? 'GREEN (Commercial Safe Root)'
      : result.status === 'red'
        ? 'RED BLOCKER (Copyleft / Restricted)'
        : 'AMBER WARNING (Uncertain License)';

  const lockfiles =
    result.detectedLockfiles.length > 0
      ? result.detectedLockfiles.slice(0, 4).join(', ')
      : 'None at root';

  return [
    `CleanRepo Instant Scan: ${result.fullName}`,
    `Verdict: ${verdict}`,
    `SPDX: ${result.spdxId} | Last Push: ${result.pushedAt.slice(0, 10)} | Lockfiles: ${lockfiles}`,
    result.hasEnterpriseDir ? `Path Alert: ${result.enterprisePaths.join(', ')}` : null,
    `Check any public GitHub repo free (no signup): https://github.com/${result.fullName}`,
  ]
    .filter(Boolean)
    .join('\n');
}
