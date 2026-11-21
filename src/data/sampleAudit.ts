export type FindingFilter = 'all' | 'blockers' | 'warnings' | 'clear';
export type FindingSeverity = 'BLOCKER' | 'RESTRICTED' | 'PATH EXCLUSION' | 'CLEAR';

export interface AuditFinding {
  id: string;
  component: string;
  repoSlug: string;
  commitSha: string;
  version: string;
  manifestSource: string;
  severity: FindingSeverity;
  filterGroup: Exclude<FindingFilter, 'all'>;
  spdxId: string;
  licensePaths: string[];
  summary: string;
  commercialImpact: string;
  remediationAction: string;
  permissiveAlternative: string;
  estimatedHours: string;
  hoursLow: number;
  hoursHigh: number;
  scorecardAggregate: number;
}

export interface ScorecardRow {
  component: string;
  commitSha: string;
  aggregate: number;
  maintained: number;
  ciTests: number;
  vulnerabilities: number;
  pinnedDeps: number;
  branchProtection: number;
  notes: string;
}

export const SAMPLE_AUDIT_META = {
  reportId: 'CR-SAMPLE-2026-1121',
  targetName: 'acme-b2b-ops-suite (Illustrative Private Acquisition Target)',
  rootCommitSha: '9f4c2e8a71b0d431e6a29c5b8f104e2d7a3c8104',
  inspectedAt: '2026-11-21T08:15:00Z',
  manifestsScanned: [
    'package-lock.json',
    'pnpm-lock.yaml',
    'services/worker/pyproject.toml',
    'services/edge/go.mod',
  ],
  totalPackagesScanned: 418,
  staticToolchain: 'licensee 9.16 · syft 1.18 · ossf/scorecard v5',
  overallGate: 'HOLD FOR REMEDIATION',
  totalRemediationHours: '38–58 eng hrs',
};

export const SAMPLE_FINDINGS: AuditFinding[] = [
  {
    id: 'CR-F01',
    component: 'documenso',
    repoSlug: 'documenso/documenso',
    commitSha: 'a3d81c2f90e4b128',
    version: '1.8.4',
    manifestSource: 'package-lock.json (apps/signing-service)',
    severity: 'BLOCKER',
    filterGroup: 'blockers',
    spdxId: 'AGPL-3.0-only',
    licensePaths: ['LICENSE', 'packages/signing/package.json'],
    summary:
      'Core e-signature module embedded with custom tenant branding modifications under GNU Affero General Public License v3.0.',
    commercialImpact:
      'AGPL-3.0 Section 13 treats remote network interaction with a modified version as distribution, triggering mandatory full source-code disclosure of the combined SaaS service unless a separate commercial license is procured from the upstream vendor.',
    remediationAction:
      'Decouple signing workflows before closing: either obtain written commercial exemption from upstream or replace the modified core with a permissive PDF assembly layer + metered signing API.',
    permissiveAlternative:
      'pdf-lib (MIT) + commercial e-signature API (or unmodified isolated microservice pending IP counsel review)',
    estimatedHours: '18–28 hrs',
    hoursLow: 18,
    hoursHigh: 28,
    scorecardAggregate: 7.4,
  },
  {
    id: 'CR-F02',
    component: 'n8n',
    repoSlug: 'n8n-io/n8n',
    commitSha: '7e19b04d31c8a562',
    version: '1.68.0',
    manifestSource: 'pnpm-lock.yaml (services/automation)',
    severity: 'RESTRICTED',
    filterGroup: 'warnings',
    spdxId: 'LicenseRef-n8n-Sustainable-Use-License',
    licensePaths: ['LICENSE.md', 'packages/cli/src/license.ee.ts'],
    summary:
      'Embedded workflow automation engine governed by source-available Sustainable Use License (SUL) plus proprietary .ee. source files.',
    commercialImpact:
      'SUL permits internal business automation only and explicitly prohibits offering the engine as a multi-tenant hosted SaaS feature or charging customers for access to the workflow runner. Any .ee. file requires a paid enterprise license.',
    remediationAction:
      'Either refactor customer-facing automations onto a permissively licensed execution engine before enterprise launch, or restrict n8n strictly to internal back-office ops / customer-owned single-tenant infrastructure.',
    permissiveAlternative:
      'Temporal SDK (MIT) / BullMQ (MIT) or Activepieces CE (MIT, with ee/ strictly excluded)',
    estimatedHours: '16–24 hrs',
    hoursLow: 16,
    hoursHigh: 24,
    scorecardAggregate: 7.8,
  },
  {
    id: 'CR-F03',
    component: 'activepieces',
    repoSlug: 'activepieces/activepieces',
    commitSha: '4c92f18b62a0f911',
    version: '0.39.2',
    manifestSource: 'pnpm-lock.yaml (packages/connectors)',
    severity: 'PATH EXCLUSION',
    filterGroup: 'warnings',
    spdxId: 'MIT AND LicenseRef-Activepieces-EE',
    licensePaths: ['LICENSE', 'packages/ee/LICENSE', 'packages/server/api/src/app/ee/'],
    summary:
      'Mixed-license monorepo: root LICENSE grants MIT for Community Edition, while packages/ee/ and server ee/ subdirectories carry proprietary enterprise terms.',
    commercialImpact:
      'Importing utilities or bundling build artifacts from packages/ee/ or packages/server/api/src/app/ee/ silently voids MIT clearance and introduces unlicensed proprietary code into production images.',
    remediationAction:
      'Add a deterministic build-time path exclusion guard and CI check that strips and blocks all imports matching **/ee/** and verifies clean MIT-only bundle manifests.',
    permissiveAlternative:
      'Retain Activepieces MIT core with automated CI path-exclusion policy + import linter',
    estimatedHours: '4–6 hrs',
    hoursLow: 4,
    hoursHigh: 6,
    scorecardAggregate: 7.1,
  },
  {
    id: 'CR-F04',
    component: 'umami',
    repoSlug: 'umami-software/umami',
    commitSha: '8b51d7e0c4f219ab',
    version: '2.14.0',
    manifestSource: 'pnpm-lock.yaml (apps/analytics)',
    severity: 'CLEAR',
    filterGroup: 'clear',
    spdxId: 'MIT',
    licensePaths: ['LICENSE', 'package.json'],
    summary:
      'Self-hosted product analytics service verified clean MIT at root and across all 64 production transitive dependencies (MIT / Apache-2.0 / ISC / BSD-3-Clause only).',
    commercialImpact:
      'No copyleft, source-available, or proprietary path blockers detected. Commercially cleared for modification, bundling, and hosted SaaS delivery.',
    remediationAction:
      'No code remediation required. Preserve upstream MIT copyright and permission notices in third-party attribution disclosures.',
    permissiveAlternative: 'No replacement needed (cleared permissive MIT stack)',
    estimatedHours: '0 hrs',
    hoursLow: 0,
    hoursHigh: 0,
    scorecardAggregate: 8.2,
  },
];

export const SAMPLE_SCORECARD_ROWS: ScorecardRow[] = [
  {
    component: 'documenso',
    commitSha: 'a3d81c2f',
    aggregate: 7.4,
    maintained: 10,
    ciTests: 9,
    vulnerabilities: 8,
    pinnedDeps: 4,
    branchProtection: 6,
    notes: 'Active release cadence; license (AGPL-3.0) is the primary acquisition blocker, not maintenance health.',
  },
  {
    component: 'n8n',
    commitSha: '7e19b04d',
    aggregate: 7.8,
    maintained: 10,
    ciTests: 9,
    vulnerabilities: 8,
    pinnedDeps: 6,
    branchProtection: 7,
    notes: 'Strong engineering hygiene; commercial SaaS restriction stems from SUL + .ee. file split.',
  },
  {
    component: 'activepieces',
    commitSha: '4c92f18b',
    aggregate: 7.1,
    maintained: 10,
    ciTests: 8,
    vulnerabilities: 9,
    pinnedDeps: 3,
    branchProtection: 5,
    notes: 'Rapid velocity; pin lockfile SHAs and enforce strict CI exclusion of packages/ee/ paths.',
  },
  {
    component: 'umami',
    commitSha: '8b51d7e0',
    aggregate: 8.2,
    maintained: 10,
    ciTests: 9,
    vulnerabilities: 10,
    pinnedDeps: 6,
    branchProtection: 7,
    notes: 'Clean MIT license tree and zero open critical CVEs at inspected commit SHA.',
  },
];

export const SAMPLE_CYCLONEDX_SBOM = {
  bomFormat: 'CycloneDX',
  specVersion: '1.5',
  serialNumber: 'urn:uuid:7c4e8a92-3b1f-4d2e-9a81-5f20c14b9e03',
  version: 1,
  metadata: {
    timestamp: SAMPLE_AUDIT_META.inspectedAt,
    tools: {
      components: [
        { type: 'application', name: 'cleanrepo-static-audit', version: '1.1.0' },
        { type: 'application', name: 'licensee', version: '9.16.0' },
        { type: 'application', name: 'syft', version: '1.18.0' },
        { type: 'application', name: 'ossf-scorecard', version: '5.0.0' },
      ],
    },
    component: {
      type: 'application',
      name: 'acme-b2b-ops-suite',
      version: `git+${SAMPLE_AUDIT_META.rootCommitSha.slice(0, 12)}`,
      properties: [
        { name: 'cleanrepo:report_id', value: SAMPLE_AUDIT_META.reportId },
        { name: 'cleanrepo:inspection_mode', value: 'static-read-only-no-exec' },
        { name: 'cleanrepo:overall_gate', value: SAMPLE_AUDIT_META.overallGate },
      ],
    },
  },
  components: SAMPLE_FINDINGS.map((f) => ({
    type: 'library',
    name: f.component,
    version: f.version,
    purl: `pkg:github/${f.repoSlug}@${f.commitSha}`,
    licenses: [{ expression: f.spdxId }],
    externalReferences: [
      {
        type: 'vcs',
        url: `https://github.com/${f.repoSlug}/tree/${f.commitSha}`,
      },
    ],
    properties: [
      { name: 'cleanrepo:finding_id', value: f.id },
      { name: 'cleanrepo:clearance_status', value: f.severity },
      { name: 'cleanrepo:manifest_source', value: f.manifestSource },
      { name: 'cleanrepo:license_paths', value: f.licensePaths.join(', ') },
      { name: 'cleanrepo:estimated_remediation_hours', value: f.estimatedHours },
      { name: 'openssf:scorecard_aggregate', value: String(f.scorecardAggregate) },
    ],
  })),
};

export interface ComparisonDimension {
  criterion: string;
  diy: string;
  enterpriseSca: string;
  lawFirm: string;
  cleanrepo: string;
}

export const COMPARISON_ROWS: ComparisonDimension[] = [
  {
    criterion: 'Typical Cost',
    diy: '$0 software + 15–30 hrs internal dev time',
    enterpriseSca: '$15,000 – $150,000+ / year annual contract',
    lawFirm: '$10,000 – $30,000+ ($600–$1,200/hr)',
    cleanrepo: 'Free public scanner · Free Pilot (first 5) / $1,200 M&A Deep Audit',
  },
  {
    criterion: 'Turnaround Time',
    diy: 'Unpredictable; rarely finishes before LOI deadline',
    enterpriseSca: '2–6 weeks sales cycle + CI onboarding',
    lawFirm: '1–3 weeks; waits on manual engineer exports',
    cleanrepo: 'Instant for public repos · 72 hours for Private/M&A Deep Audit',
  },
  {
    criterion: 'Transitive Lockfiles & /ee Paths',
    diy: 'High false positives; misses SUL & /ee splits',
    enterpriseSca: 'Strong scanning, noisy triage without senior engineer review',
    lawFirm: 'Rarely inspects lockfiles, sub-trees, or build graphs',
    cleanrepo: 'Commit-SHA SBOM + /ee, SUL, AGPL & NOASSERTION audit',
  },
  {
    criterion: 'Supply-Chain & Maintenance Health',
    diy: 'Not included',
    enterpriseSca: 'CVE alerts only (separate paid tier for health)',
    lawFirm: 'Not included',
    cleanrepo: 'OpenSSF Scorecard v5 maintenance & security summary',
  },
  {
    criterion: 'Actionable Remediation Plan',
    diy: 'Raw JSON dump; no replacement estimates',
    enterpriseSca: 'Policy flags only; no drop-in architecture plan',
    lawFirm: 'Legal risk memo without engineering swap hours',
    cleanrepo: 'MIT/Apache-2.0 drop-ins + engineering replacement hour ranges',
  },
];
