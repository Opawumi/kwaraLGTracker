'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PublicLayout from '@/components/public/PublicLayout';
import { AllocationLineChart, RevenueBreakdownChart } from '@/components/public/Charts';
import {
  lgas,
  publishedRecords,
  getLGABySlug,
  getRecordsByLGA,
  supportingDocuments,
  YEARS,
} from '@/data/demoData';
import { formatNaira, formatNairaShort, formatDate } from '@/lib/utils';
import {
  FiMapPin,
  FiUsers,
  FiMaximize2,
  FiTrendingUp,
  FiCalendar,
  FiDownload,
  FiFileText,
  FiCheckCircle,
  FiArrowLeft,
  FiDollarSign,
} from 'react-icons/fi';

interface LgaDetailsClientProps {
  slug: string;
}

export default function LgaDetailsClient({ slug }: LgaDetailsClientProps) {
  const lga = getLGABySlug(slug);

  if (!lga) {
    notFound();
  }

  const [selectedYear, setSelectedYear] = useState<string>('2026');

  // All published records for this LGA
  const allLgaRecords = useMemo(() => getRecordsByLGA(slug), [slug]);

  // Filtered by year
  const yearlyRecords = useMemo(() => {
    return allLgaRecords
      .filter((r) => selectedYear === 'all' || r.year === parseInt(selectedYear, 10))
      .sort((a, b) => b.year - a.year || b.month - a.month);
  }, [allLgaRecords, selectedYear]);

  // Statistics
  const totalAllocated = useMemo(() => {
    return yearlyRecords.reduce((sum, r) => sum + r.netAllocation, 0);
  }, [yearlyRecords]);

  const latestRecord = useMemo(() => {
    return [...allLgaRecords].sort((a, b) => b.year - a.year || b.month - a.month)[0];
  }, [allLgaRecords]);

  // Trend chart data (sorted chronologically for chart)
  const chartTrend = useMemo(() => {
    const sorted = [...yearlyRecords].sort((a, b) => a.year - b.year || a.month - b.month);
    return {
      labels: sorted.map((r) => `${r.monthName.slice(0, 3)} '${r.year.toString().slice(2)}`),
      data: sorted.map((r) => r.netAllocation),
    };
  }, [yearlyRecords]);

  // Revenue breakdown aggregates for current selection
  const revenueAggregates = useMemo(() => {
    return yearlyRecords.reduce(
      (acc, r) => {
        acc.statutory += r.statutoryAllocation;
        acc.vat += r.vatAllocation;
        acc.excessCrude += r.excessCrude;
        acc.other += r.otherRevenue;
        acc.deductions += r.totalDeductions;
        return acc;
      },
      { statutory: 0, vat: 0, excessCrude: 0, other: 0, deductions: 0 }
    );
  }, [yearlyRecords]);

  // Relevant supporting documents
  const relevantDocs = supportingDocuments.slice(0, 3);

  // Download LGA Profile Report simulation
  const handleDownloadReport = () => {
    const content = `KWARA STATE GOVERNMENT - LOCAL GOVERNMENT ALLOCATION REPORT
LGA: ${lga.name}
Headquarters: ${lga.headquarters}
Estimated Population: ${lga.population}
Selected Period: ${selectedYear === 'all' ? 'All Years' : selectedYear}
Total Net Allocation: ${formatNaira(totalAllocated)}
Latest Net Allocation: ${latestRecord ? formatNaira(latestRecord.netAllocation) : 'N/A'}
Report Generated: ${new Date().toLocaleDateString()}

NOTICE: DEMO DATA - For transparency platform illustration only.
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${lga.slug}_allocation_report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PublicLayout>
      {/* Header Profile Section */}
      <section className="page-header">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item"><Link href="/allocations">Allocations</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{lga.name}</li>
            </ol>
          </nav>

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3">
            <div className="lga-profile-header">
              <div className="lga-icon-box text-white fw-bold">
                {lga.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="mb-1">{lga.name} Local Government Area</h1>
                <p className="mb-0 text-white-50">
                  <FiMapPin className="me-1" /> HQ: <strong>{lga.headquarters}</strong> &nbsp;|&nbsp;
                  <FiUsers className="ms-2 me-1" /> Pop: <strong>{lga.population}</strong> &nbsp;|&nbsp;
                  <FiMaximize2 className="ms-2 me-1" /> Area: <strong>{lga.area}</strong>
                </p>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button onClick={handleDownloadReport} className="btn btn-accent d-inline-flex align-items-center gap-2">
                <FiDownload /> Download Profile Report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-4">
        {/* Quick summary stats */}
        <div className="row g-3 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="stat-card h-100">
              <div className="stat-icon green">
                <FiDollarSign />
              </div>
              <div className="stat-label">Total Allocations ({selectedYear === 'all' ? 'All-Time' : selectedYear})</div>
              <div className="stat-value text-success">{formatNairaShort(totalAllocated)}</div>
              <div className="stat-subtitle">{formatNaira(totalAllocated)}</div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="stat-card h-100">
              <div className="stat-icon blue">
                <FiTrendingUp />
              </div>
              <div className="stat-label">Latest Monthly Net Allocation</div>
              <div className="stat-value">{latestRecord ? formatNairaShort(latestRecord.netAllocation) : '—'}</div>
              <div className="stat-subtitle">
                {latestRecord ? `${latestRecord.monthName} ${latestRecord.year} (${formatNaira(latestRecord.netAllocation)})` : 'No records'}
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-12">
            <div className="stat-card h-100">
              <div className="stat-icon purple">
                <FiCalendar />
              </div>
              <div className="stat-label">Total Verified Distributions</div>
              <div className="stat-value">{yearlyRecords.length} Months</div>
              <div className="stat-subtitle">Published records in selected scope</div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar for page */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 p-3 bg-white border rounded">
          <div className="fw-semibold text-secondary">
            Financial Analysis & Distribution History
          </div>
          <div className="d-flex align-items-center gap-2">
            <label className="text-muted small text-nowrap mb-0">Filter by Year:</label>
            <select
              className="form-select form-select-sm"
              style={{ width: 140 }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="all">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Charts Row: Trend line + Revenue breakdown */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="data-card h-100">
              <div className="card-header-custom">
                <h3>Allocation Trend & Net Receipts ({selectedYear === 'all' ? 'All Periods' : selectedYear})</h3>
              </div>
              <div className="card-body-custom">
                {chartTrend.labels.length > 0 ? (
                  <AllocationLineChart
                    labels={chartTrend.labels}
                    data={chartTrend.data}
                    label={`${lga.name} Net Allocation`}
                  />
                ) : (
                  <div className="empty-state py-5">
                    <h4>No data available for this year</h4>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="data-card h-100">
              <div className="card-header-custom">
                <h3>Revenue Component Breakdown</h3>
              </div>
              <div className="card-body-custom">
                {yearlyRecords.length > 0 ? (
                  <RevenueBreakdownChart
                    statutory={revenueAggregates.statutory}
                    vat={revenueAggregates.vat}
                    excessCrude={revenueAggregates.excessCrude}
                    other={revenueAggregates.other}
                  />
                ) : (
                  <div className="empty-state py-5">
                    <h4>No breakdown data</h4>
                  </div>
                )}
                <div className="mt-3 pt-3 border-top small text-muted">
                  <div className="d-flex justify-content-between py-1">
                    <span>Statutory Allocation:</span>
                    <strong className="text-dark">{formatNairaShort(revenueAggregates.statutory)}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span>VAT Component:</span>
                    <strong className="text-dark">{formatNairaShort(revenueAggregates.vat)}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span>Excess Crude & Other:</span>
                    <strong className="text-dark">{formatNairaShort(revenueAggregates.excessCrude + revenueAggregates.other)}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-top mt-1 text-danger">
                    <span>Total Deductions:</span>
                    <strong>({formatNairaShort(revenueAggregates.deductions)})</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Allocation History Table */}
        <div className="data-card mb-4">
          <div className="card-header-custom">
            <h3>Monthly Allocation Records — {lga.name}</h3>
            <span className="badge bg-primary text-white">
              {yearlyRecords.length} Record{yearlyRecords.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Period</th>
                  <th className="text-end">Statutory</th>
                  <th className="text-end">VAT</th>
                  <th className="text-end">Gross Total</th>
                  <th className="text-end">Deductions</th>
                  <th className="text-end">Net Allocation</th>
                  <th>Publication Date</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {yearlyRecords.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-semibold">
                      {r.monthName} {r.year}
                    </td>
                    <td className="text-end font-monospace">{formatNaira(r.statutoryAllocation)}</td>
                    <td className="text-end font-monospace">{formatNaira(r.vatAllocation)}</td>
                    <td className="text-end font-monospace">{formatNaira(r.grossAllocation)}</td>
                    <td className="text-end font-monospace text-danger">({formatNaira(r.totalDeductions)})</td>
                    <td className="text-end font-monospace fw-bold text-success">{formatNaira(r.netAllocation)}</td>
                    <td>{formatDate(r.publishedDate)}</td>
                    <td className="text-center">
                      <span className="badge bg-success-subtle text-success border border-success">
                        <FiCheckCircle className="me-1" /> Published
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supporting Documents Section */}
        <div className="data-card mb-4">
          <div className="card-header-custom">
            <h3>Official Supporting Documents & Verification Records</h3>
          </div>
          <div className="card-body-custom">
            <p className="text-muted small mb-3">
              Official FAAC schedules, deduction advisories, and certified warrants corresponding to {lga.name} Local Government Area allocations.
            </p>
            <div className="row g-3">
              {relevantDocs.map((doc) => (
                <div className="col-md-4" key={doc.id}>
                  <div className="p-3 border rounded bg-light d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <FiFileText size={24} className="text-primary" />
                      <div>
                        <div className="fw-semibold small text-truncate" style={{ maxWidth: 170 }}>
                          {doc.name}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {doc.type} • {doc.size} • {formatDate(doc.uploadedDate)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleDownloadReport}
                      className="btn btn-sm btn-outline-secondary p-1 px-2"
                      title="Download file"
                    >
                      <FiDownload size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-3">
          <Link href="/allocations" className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
            <FiArrowLeft /> Back to All Allocations
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
