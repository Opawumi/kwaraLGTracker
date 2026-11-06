'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { AllocationLineChart, AllocationBarChart, RevenueBreakdownChart } from '@/components/public/Charts';
import {
  lgas,
  publishedRecords,
  getMonthlyTrendData,
  getLGAComparisonData,
  YEARS,
} from '@/data/demoData';
import { formatNaira, formatNairaShort } from '@/lib/utils';
import {
  FiDownload,
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
  FiBarChart2,
  FiFileText,
  FiAward,
} from 'react-icons/fi';

export default function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Filter records for selected year
  const recordsForYear = useMemo(() => {
    return publishedRecords.filter((r) => r.year === selectedYear);
  }, [selectedYear]);

  // Total allocation for the year
  const totalYearAllocation = useMemo(() => {
    return recordsForYear.reduce((sum, r) => sum + r.netAllocation, 0);
  }, [recordsForYear]);

  const grossTotalYear = useMemo(() => {
    return recordsForYear.reduce((sum, r) => sum + r.grossAllocation, 0);
  }, [recordsForYear]);

  const deductionsTotalYear = useMemo(() => {
    return recordsForYear.reduce((sum, r) => sum + r.totalDeductions, 0);
  }, [recordsForYear]);

  // Aggregate revenue components for doughnut chart
  const revenueComponents = useMemo(() => {
    return recordsForYear.reduce(
      (acc, r) => {
        acc.statutory += r.statutoryAllocation;
        acc.vat += r.vatAllocation;
        acc.excessCrude += r.excessCrude;
        acc.other += r.otherRevenue;
        return acc;
      },
      { statutory: 0, vat: 0, excessCrude: 0, other: 0 }
    );
  }, [recordsForYear]);

  // Highest and lowest allocations in this year
  const highestAllocation = useMemo(() => {
    if (recordsForYear.length === 0) return null;
    return [...recordsForYear].sort((a, b) => b.netAllocation - a.netAllocation)[0];
  }, [recordsForYear]);

  const lowestAllocation = useMemo(() => {
    if (recordsForYear.length === 0) return null;
    return [...recordsForYear].sort((a, b) => a.netAllocation - b.netAllocation)[0];
  }, [recordsForYear]);

  // LGA total allocations for this year ranking
  const lgaRankings = useMemo(() => {
    const map = new Map<string, { name: string; totalNet: number; count: number }>();
    lgas.forEach((l) => map.set(l.id, { name: l.name, totalNet: 0, count: 0 }));

    recordsForYear.forEach((r) => {
      const entry = map.get(r.lgaId);
      if (entry) {
        entry.totalNet += r.netAllocation;
        entry.count += 1;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalNet - a.totalNet);
  }, [recordsForYear]);

  // Monthly trend chart data
  const trendData = useMemo(() => getMonthlyTrendData(selectedYear), [selectedYear]);

  // LGA comparison chart data
  const lgaComparison = useMemo(() => getLGAComparisonData(selectedYear), [selectedYear]);

  // Export handlers
  const handleExportPDF = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const headers = ['Rank', 'Local Government Area', 'Total Net Allocation (NGN)', 'Months Published'];
    const rows = lgaRankings.map((lga, i) => [
      i + 1,
      lga.name,
      lga.totalNet,
      lga.count
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kwara_lga_annual_report_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Reports & Analytics</li>
            </ol>
          </nav>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h1 className="mb-1">Reports & Financial Analytics</h1>
              <p className="mb-0">
                Institutional analytics, annual reviews, and comparative distribution trends for Kwara State LGAs.
              </p>
            </div>
            <div className="d-flex gap-2">
              <button onClick={handleExportExcel} className="btn btn-outline-light btn-sm d-inline-flex align-items-center gap-2">
                <FiDownload /> Export Excel
              </button>
              <button onClick={handleExportPDF} className="btn btn-accent btn-sm d-inline-flex align-items-center gap-2">
                <FiFileText /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-4">
        {/* Year Selector Toolbar */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 p-3 bg-white border rounded">
          <div className="fw-bold text-primary">
            Reporting Period Analysis
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted">Select Fiscal Year:</span>
            <div className="btn-group" role="group">
              {YEARS.map((year) => (
                <button
                  key={year}
                  type="button"
                  className={`btn btn-sm ${selectedYear === year ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Highlight Summary Stats */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="stat-card h-100">
              <div className="stat-icon green">
                <FiAward />
              </div>
              <div className="stat-label">Total Net Distribution ({selectedYear})</div>
              <div className="stat-value text-success">{formatNairaShort(totalYearAllocation)}</div>
              <div className="stat-subtitle">{formatNaira(totalYearAllocation)}</div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stat-card h-100">
              <div className="stat-icon blue">
                <FiTrendingUp />
              </div>
              <div className="stat-label">Total Gross Receipts</div>
              <div className="stat-value">{formatNairaShort(grossTotalYear)}</div>
              <div className="stat-subtitle">Prior to statutory deductions</div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stat-card h-100">
              <div className="stat-icon orange">
                <FiTrendingUp />
              </div>
              <div className="stat-label">Highest Single Allocation</div>
              <div className="stat-value" style={{ fontSize: '1.25rem' }}>
                {highestAllocation ? formatNairaShort(highestAllocation.netAllocation) : '—'}
              </div>
              <div className="stat-subtitle text-truncate">
                {highestAllocation ? `${highestAllocation.lgaName} (${highestAllocation.monthName})` : '—'}
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stat-card h-100">
              <div className="stat-icon purple">
                <FiTrendingDown />
              </div>
              <div className="stat-label">Lowest Single Allocation</div>
              <div className="stat-value" style={{ fontSize: '1.25rem' }}>
                {lowestAllocation ? formatNairaShort(lowestAllocation.netAllocation) : '—'}
              </div>
              <div className="stat-subtitle text-truncate">
                {lowestAllocation ? `${lowestAllocation.lgaName} (${lowestAllocation.monthName})` : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section: Monthly Trend & Revenue Breakdown */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="data-card h-100">
              <div className="card-header-custom">
                <h3>
                  <FiTrendingUp className="me-2 text-primary" />
                  Monthly Allocation Trend ({selectedYear})
                </h3>
              </div>
              <div className="card-body-custom">
                <AllocationLineChart
                  labels={trendData.labels}
                  data={trendData.data}
                  label="State-Wide Monthly Net Distribution"
                />
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="data-card h-100">
              <div className="card-header-custom">
                <h3>
                  <FiPieChart className="me-2 text-primary" />
                  Revenue Components Ratio
                </h3>
              </div>
              <div className="card-body-custom">
                <RevenueBreakdownChart
                  statutory={revenueComponents.statutory}
                  vat={revenueComponents.vat}
                  excessCrude={revenueComponents.excessCrude}
                  other={revenueComponents.other}
                />
                <div className="mt-3 pt-3 border-top small">
                  <div className="d-flex justify-content-between py-1 text-muted">
                    <span>Statutory Total:</span>
                    <strong className="text-dark">{formatNairaShort(revenueComponents.statutory)}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 text-muted">
                    <span>VAT Component:</span>
                    <strong className="text-dark">{formatNairaShort(revenueComponents.vat)}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 text-danger">
                    <span>Deductions Applied:</span>
                    <strong>({formatNairaShort(deductionsTotalYear)})</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LGA Allocation Comparison (Horizontal Bar Chart) */}
        <div className="data-card mb-4">
          <div className="card-header-custom">
            <h3>
              <FiBarChart2 className="me-2 text-primary" />
              Comparative Allocation by Local Government Area ({selectedYear})
            </h3>
          </div>
          <div className="card-body-custom">
            <AllocationBarChart
              labels={lgaComparison.labels}
              data={lgaComparison.data}
              label={`Total Net Allocation in ${selectedYear}`}
              horizontal
            />
          </div>
        </div>

        {/* Annual LGA Ranking Table */}
        <div className="data-card mb-4">
          <div className="card-header-custom">
            <h3>Cumulative LGA Allocation Ranking ({selectedYear})</h3>
            <button onClick={handleExportExcel} className="btn btn-sm btn-outline-primary">
              <FiDownload className="me-1" /> Export Table
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>#</th>
                  <th>Local Government Area</th>
                  <th>Months Recorded</th>
                  <th className="text-end">Total Net Allocation</th>
                  <th className="text-end">Average Monthly Receipt</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {lgaRankings.map((item, index) => {
                  const slug = lgas.find(l => l.name === item.name)?.slug || 'asa';
                  const avgMonthly = item.count > 0 ? Math.round(item.totalNet / item.count) : 0;
                  return (
                    <tr key={item.name}>
                      <td className="fw-bold text-muted">{index + 1}</td>
                      <td className="fw-semibold">
                        <Link href={`/allocations/${slug}`} className="text-decoration-none text-dark">
                          {item.name}
                        </Link>
                      </td>
                      <td>{item.count} months</td>
                      <td className="text-end font-monospace fw-bold text-success">
                        {formatNaira(item.totalNet)}
                      </td>
                      <td className="text-end font-monospace text-muted">
                        {formatNaira(avgMonthly)}
                      </td>
                      <td className="text-center">
                        <Link href={`/allocations/${slug}`} className="btn btn-sm btn-outline-primary py-1 px-3">
                          Profile
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
