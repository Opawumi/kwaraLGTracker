// ============================================================
// DEMO DATA — All figures are fictional and for illustration only.
// They do NOT represent actual government allocations.
// ============================================================

export interface LGA {
  id: string;
  slug: string;
  name: string;
  state: string;
  chairman: string;
  headquarters: string;
  population: string;
  area: string;
}

export interface AllocationRecord {
  id: string;
  lgaId: string;
  lgaName: string;
  state: string;
  month: number;
  monthName: string;
  year: number;
  grossAllocation: number;
  statutoryAllocation: number;
  vatAllocation: number;
  excessCrude: number;
  otherRevenue: number;
  totalDeductions: number;
  penaltyDeductions: number;
  loanDeductions: number;
  otherDeductions: number;
  netAllocation: number;
  status: 'Published' | 'Draft';
  publishedDate: string | null;
  createdDate: string;
  createdBy: string;
  notes: string;
  supportingDocuments: SupportingDocument[];
}

export interface SupportingDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedDate: string;
  uploadedBy: string;
}

export interface AuditLog {
  id: string;
  administrator: string;
  action: string;
  recordAffected: string;
  dateTime: string;
  previousValue: string | null;
  updatedValue: string | null;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
}

// Kwara State LGAs
export const lgas: LGA[] = [
  { id: 'lga-01', slug: 'asa', name: 'Asa', state: 'Kwara', chairman: '—', headquarters: 'Afon', population: '126,435', area: '1,286 km²' },
  { id: 'lga-02', slug: 'baruten', name: 'Baruten', state: 'Kwara', chairman: '—', headquarters: 'Kosubosu', population: '209,432', area: '5,765 km²' },
  { id: 'lga-03', slug: 'edu', name: 'Edu', state: 'Kwara', chairman: '—', headquarters: 'Lafiagi', population: '134,520', area: '2,621 km²' },
  { id: 'lga-04', slug: 'ekiti-kwara', name: 'Ekiti (Kwara)', state: 'Kwara', chairman: '—', headquarters: 'Araromi-Opin', population: '58,921', area: '567 km²' },
  { id: 'lga-05', slug: 'ifelodun', name: 'Ifelodun', state: 'Kwara', chairman: '—', headquarters: 'Share', population: '149,278', area: '3,435 km²' },
  { id: 'lga-06', slug: 'ilorin-east', name: 'Ilorin East', state: 'Kwara', chairman: '—', headquarters: 'Oke-Oyi', population: '204,310', area: '486 km²' },
  { id: 'lga-07', slug: 'ilorin-south', name: 'Ilorin South', state: 'Kwara', chairman: '—', headquarters: 'Fufu', population: '225,198', area: '466 km²' },
  { id: 'lga-08', slug: 'ilorin-west', name: 'Ilorin West', state: 'Kwara', chairman: '—', headquarters: 'Ilorin', population: '365,221', area: '765 km²' },
  { id: 'lga-09', slug: 'irepodun', name: 'Irepodun', state: 'Kwara', chairman: '—', headquarters: 'Omu-Aran', population: '148,610', area: '1,095 km²' },
  { id: 'lga-10', slug: 'isin', name: 'Isin', state: 'Kwara', chairman: '—', headquarters: 'Owu-Isin', population: '62,475', area: '733 km²' },
  { id: 'lga-11', slug: 'kaiama', name: 'Kaiama', state: 'Kwara', chairman: '—', headquarters: 'Kaiama', population: '120,382', area: '4,025 km²' },
  { id: 'lga-12', slug: 'moro', name: 'Moro', state: 'Kwara', chairman: '—', headquarters: 'Bode Saadu', population: '108,792', area: '2,797 km²' },
  { id: 'lga-13', slug: 'offa', name: 'Offa', state: 'Kwara', chairman: '—', headquarters: 'Offa', population: '113,538', area: '344 km²' },
  { id: 'lga-14', slug: 'oke-ero', name: 'Oke Ero', state: 'Kwara', chairman: '—', headquarters: 'Iloffa', population: '56,970', area: '635 km²' },
  { id: 'lga-15', slug: 'oyun', name: 'Oyun', state: 'Kwara', chairman: '—', headquarters: 'Ilemona', population: '94,250', area: '632 km²' },
  { id: 'lga-16', slug: 'patigi', name: 'Patigi', state: 'Kwara', chairman: '—', headquarters: 'Patigi', population: '82,418', area: '1,485 km²' },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const YEARS = [2024, 2025, 2026];

// Generate demo allocation records
function generateAllocationRecords(): AllocationRecord[] {
  const records: AllocationRecord[] = [];
  let counter = 1;

  // Seeded PRNG (mulberry32) so server and client generate identical data
  // (Math.random() caused hydration mismatches).
  let seed = 20240601;
  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // Generate records for 2024 (all months), 2025 (all months), 2026 (Jan-Sep)
  const periods: { year: number; months: number[] }[] = [
    { year: 2024, months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { year: 2025, months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { year: 2026, months: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
  ];

  for (const period of periods) {
    for (const month of period.months) {
      for (const lga of lgas) {
        // Generate realistic-looking figures (fictional)
        const baseAllocation = 180_000_000 + Math.floor(random() * 120_000_000);
        const statutoryAllocation = Math.floor(baseAllocation * 0.55);
        const vatAllocation = Math.floor(baseAllocation * 0.28);
        const excessCrude = Math.floor(baseAllocation * 0.10);
        const otherRevenue = Math.floor(baseAllocation * 0.07);
        const grossAllocation = statutoryAllocation + vatAllocation + excessCrude + otherRevenue;

        const penaltyDeductions = Math.floor(grossAllocation * 0.015);
        const loanDeductions = Math.floor(grossAllocation * 0.035);
        const otherDeductions = Math.floor(grossAllocation * 0.01);
        const totalDeductions = penaltyDeductions + loanDeductions + otherDeductions;
        const netAllocation = grossAllocation - totalDeductions;

        // Most records are published, some recent ones are drafts
        const isDraft = period.year === 2026 && month >= 8;
        const publishedDate = isDraft ? null : `${period.year}-${String(month).padStart(2, '0')}-25`;

        records.push({
          id: `alloc-${String(counter).padStart(4, '0')}`,
          lgaId: lga.id,
          lgaName: lga.name,
          state: lga.state,
          month,
          monthName: MONTHS[month - 1],
          year: period.year,
          grossAllocation,
          statutoryAllocation,
          vatAllocation,
          excessCrude,
          otherRevenue,
          totalDeductions,
          penaltyDeductions,
          loanDeductions,
          otherDeductions,
          netAllocation,
          status: isDraft ? 'Draft' : 'Published',
          publishedDate,
          createdDate: `${period.year}-${String(month).padStart(2, '0')}-20`,
          createdBy: 'Admin',
          notes: isDraft ? 'Pending review and verification.' : '',
          supportingDocuments: [],
        });
        counter++;
      }
    }
  }

  return records;
}

export const allocationRecords = generateAllocationRecords();

// Published records only
export const publishedRecords = allocationRecords.filter(r => r.status === 'Published');

// Draft records only
export const draftRecords = allocationRecords.filter(r => r.status === 'Draft');

// Get records for a specific LGA
export function getRecordsByLGA(lgaSlug: string): AllocationRecord[] {
  const lga = lgas.find(l => l.slug === lgaSlug);
  if (!lga) return [];
  return publishedRecords.filter(r => r.lgaId === lga.id);
}

// Get a specific LGA by slug
export function getLGABySlug(slug: string): LGA | undefined {
  return lgas.find(l => l.slug === slug);
}

// Calculate totals
export function getTotalAllocations(records: AllocationRecord[]): number {
  return records.reduce((sum, r) => sum + r.netAllocation, 0);
}

export function getLatestPeriod(): string {
  const latestPublished = publishedRecords.sort(
    (a, b) => b.year - a.year || b.month - a.month
  )[0];
  return latestPublished ? `${latestPublished.monthName} ${latestPublished.year}` : '—';
}

// Monthly trend data
export function getMonthlyTrendData(year: number): { labels: string[]; data: number[] } {
  const labels: string[] = [];
  const data: number[] = [];

  for (let m = 1; m <= 12; m++) {
    const monthRecords = publishedRecords.filter(r => r.year === year && r.month === m);
    if (monthRecords.length > 0) {
      labels.push(MONTHS[m - 1].substring(0, 3));
      data.push(monthRecords.reduce((sum, r) => sum + r.netAllocation, 0));
    }
  }

  return { labels, data };
}

// LGA comparison data for a given period
export function getLGAComparisonData(year: number, month?: number): { labels: string[]; data: number[] } {
  const labels: string[] = [];
  const data: number[] = [];

  for (const lga of lgas) {
    let records = publishedRecords.filter(r => r.lgaId === lga.id && r.year === year);
    if (month) {
      records = records.filter(r => r.month === month);
    }
    labels.push(lga.name);
    data.push(records.reduce((sum, r) => sum + r.netAllocation, 0));
  }

  return { labels, data };
}

// Demo audit logs
export const auditLogs: AuditLog[] = [
  { id: 'log-001', administrator: 'admin@kwara.gov.ng', action: 'Published allocation record', recordAffected: 'Ilorin West — July 2026', dateTime: '2026-08-15 09:34:21', previousValue: 'Draft', updatedValue: 'Published' },
  { id: 'log-002', administrator: 'admin@kwara.gov.ng', action: 'Created allocation record', recordAffected: 'Asa — August 2026', dateTime: '2026-08-14 14:12:05', previousValue: null, updatedValue: 'Draft' },
  { id: 'log-003', administrator: 'finance@kwara.gov.ng', action: 'Uploaded bulk records', recordAffected: 'September 2026 (16 records)', dateTime: '2026-09-22 11:08:44', previousValue: null, updatedValue: 'Draft' },
  { id: 'log-004', administrator: 'admin@kwara.gov.ng', action: 'Edited allocation record', recordAffected: 'Offa — June 2026', dateTime: '2026-07-20 16:45:33', previousValue: '₦245,000,000', updatedValue: '₦248,500,000' },
  { id: 'log-005', administrator: 'finance@kwara.gov.ng', action: 'Published allocation record', recordAffected: 'Baruten — July 2026', dateTime: '2026-08-15 09:40:18', previousValue: 'Draft', updatedValue: 'Published' },
  { id: 'log-006', administrator: 'admin@kwara.gov.ng', action: 'Uploaded supporting document', recordAffected: 'FAAC_Breakdown_July_2026.pdf', dateTime: '2026-08-12 08:22:10', previousValue: null, updatedValue: null },
  { id: 'log-007', administrator: 'admin@kwara.gov.ng', action: 'Deleted draft record', recordAffected: 'Kaiama — August 2026 (duplicate)', dateTime: '2026-08-14 15:03:56', previousValue: 'Draft', updatedValue: 'Deleted' },
  { id: 'log-008', administrator: 'finance@kwara.gov.ng', action: 'Published allocation record', recordAffected: 'Edu — July 2026', dateTime: '2026-08-15 09:42:01', previousValue: 'Draft', updatedValue: 'Published' },
];

// Demo admin users
export const adminUsers: AdminUser[] = [
  { id: 'usr-001', name: 'Abdulrahman Ibrahim', email: 'admin@kwara.gov.ng', role: 'Super Admin', lastLogin: '2026-10-30 08:15:00', status: 'Active' },
  { id: 'usr-002', name: 'Funke Adeyemi', email: 'finance@kwara.gov.ng', role: 'Finance Officer', lastLogin: '2026-10-29 14:30:00', status: 'Active' },
  { id: 'usr-003', name: 'Musa Alabi', email: 'audit@kwara.gov.ng', role: 'Auditor', lastLogin: '2026-10-25 11:00:00', status: 'Active' },
  { id: 'usr-004', name: 'Chioma Okafor', email: 'data@kwara.gov.ng', role: 'Data Entry', lastLogin: '2026-09-18 09:45:00', status: 'Inactive' },
];

// Demo supporting documents
export const supportingDocuments: SupportingDocument[] = [
  { id: 'doc-001', name: 'FAAC_Breakdown_July_2026.pdf', type: 'PDF', size: '2.4 MB', uploadedDate: '2026-08-12', uploadedBy: 'admin@kwara.gov.ng' },
  { id: 'doc-002', name: 'VAT_Distribution_July_2026.xlsx', type: 'Excel', size: '1.1 MB', uploadedDate: '2026-08-12', uploadedBy: 'finance@kwara.gov.ng' },
  { id: 'doc-003', name: 'FAAC_Breakdown_June_2026.pdf', type: 'PDF', size: '2.2 MB', uploadedDate: '2026-07-15', uploadedBy: 'admin@kwara.gov.ng' },
  { id: 'doc-004', name: 'Allocation_Summary_Q2_2026.pdf', type: 'PDF', size: '3.8 MB', uploadedDate: '2026-07-10', uploadedBy: 'admin@kwara.gov.ng' },
  { id: 'doc-005', name: 'FAAC_Breakdown_May_2026.pdf', type: 'PDF', size: '2.1 MB', uploadedDate: '2026-06-14', uploadedBy: 'finance@kwara.gov.ng' },
  { id: 'doc-006', name: 'LGA_Revenue_Template_2026.xlsx', type: 'Excel', size: '0.5 MB', uploadedDate: '2026-01-05', uploadedBy: 'admin@kwara.gov.ng' },
];
