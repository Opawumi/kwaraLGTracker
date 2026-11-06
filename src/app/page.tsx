'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { AllocationLineChart, AllocationBarChart } from '@/components/public/Charts';
import {
  lgas,
  publishedRecords,
  getMonthlyTrendData,
  getLGAComparisonData,
  getLatestPeriod,
  getTotalAllocations,
} from '@/data/demoData';
import { formatNaira, formatNairaShort, formatDate } from '@/lib/utils';
import {
  FiSearch,
  FiTrendingUp,
  FiMapPin,
  FiFileText,
  FiCalendar,
  FiArrowRight,
  FiBarChart2,
} from 'react-icons/fi';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Stats
  const totalAllocation = getTotalAllocations(publishedRecords);
  const latestPeriod = getLatestPeriod();
  const totalPublished = publishedRecords.length;

  // Chart data
  const trendData2026 = getMonthlyTrendData(2026);
  const lgaComparison = getLGAComparisonData(2026);

  // Latest 8 records
  const latestRecords = useMemo(() => {
    return [...publishedRecords]
      .sort((a, b) => b.year - a.year || b.month - a.month)
      .slice(0, 8);
  }, []);

  // Search filter
  const filteredLGAs = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return lgas.filter((l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // LGA grid search
  const [lgaGridSearch, setLgaGridSearch] = useState('');
  const filteredLGAGrid = useMemo(() => {
    if (!lgaGridSearch.trim()) return lgas;
    return lgas.filter((l) =>
      l.name.toLowerCase().includes(lgaGridSearch.toLowerCase())
    );
  }, [lgaGridSearch]);

  // Get latest net allocation per LGA
  function getLatestLGAAllocation(lgaId: string): number {
    const records = publishedRecords
      .filter((r) => r.lgaId === lgaId)
      .sort((a, b) => b.year - a.year || b.month - a.month);
    return records[0]?.netAllocation ?? 0;
  }

  return (
    <PublicLayout>
      {/* ====== HERO ====== */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Making Local Government Allocations Accessible to Everyone</h1>
            <p>
              Explore allocation records, track monthly financial distributions and
              access transparent financial information for every Local Government Area
              in Kwara State.
            </p>

            {/* Search */}
            <div className="hero-search" style={{ marginBottom: 24 }}>
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for a Local Government Area..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
              {showResults && filteredLGAs.length > 0 && (
                <div className="hero-search-results">
                  {filteredLGAs.map((lga) => (
                    <Link
                      key={lga.id}
                      href={`/allocations/${lga.slug}`}
                    >
                      {lga.name}
                      <span className="lga-state">Kwara State</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/allocations" className="btn btn-accent">
              Explore Allocations <FiArrowRight style={{ marginLeft: 8 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== STATISTICS ====== */}
      <section style={{ marginTop: -40, position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="row g-3">
            <div className="col-lg-3 col-md-6 col-6">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <FiTrendingUp />
                </div>
                <div className="stat-label">Total State Allocation</div>
                <div className="stat-value">{formatNairaShort(totalAllocation)}</div>
                <div className="stat-subtitle">All published records</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-6">
              <div className="stat-card">
                <div className="stat-icon green">
                  <FiMapPin />
                </div>
                <div className="stat-label">Total LGAs</div>
                <div className="stat-value">{lgas.length}</div>
                <div className="stat-subtitle">Local Government Areas</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-6">
              <div className="stat-card">
                <div className="stat-icon orange">
                  <FiFileText />
                </div>
                <div className="stat-label">Published Records</div>
                <div className="stat-value">{totalPublished.toLocaleString()}</div>
                <div className="stat-subtitle">Allocation entries</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-6">
              <div className="stat-card">
                <div className="stat-icon purple">
                  <FiCalendar />
                </div>
                <div className="stat-label">Latest Period</div>
                <div className="stat-value" style={{ fontSize: '1.2rem' }}>{latestPeriod}</div>
                <div className="stat-subtitle">Most recent publication</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== ALLOCATION OVERVIEW ====== */}
      <section className="content-section">
        <div className="container">
          <h2 className="section-heading">Allocation Overview</h2>
          <p className="section-subheading">
            Monthly allocation trends and LGA comparison for the current year.
          </p>

          <div className="row g-4">
            {/* Monthly Trend */}
            <div className="col-lg-7">
              <div className="data-card">
                <div className="card-header-custom">
                  <h3>
                    <FiTrendingUp style={{ marginRight: 8, opacity: 0.5 }} />
                    Monthly Allocation Trend — 2026
                  </h3>
                </div>
                <div className="card-body-custom">
                  <AllocationLineChart
                    labels={trendData2026.labels}
                    data={trendData2026.data}
                    label="Total Net Allocation"
                  />
                </div>
              </div>
            </div>

            {/* LGA Comparison */}
            <div className="col-lg-5">
              <div className="data-card">
                <div className="card-header-custom">
                  <h3>
                    <FiBarChart2 style={{ marginRight: 8, opacity: 0.5 }} />
                    LGA Comparison — 2026
                  </h3>
                </div>
                <div className="card-body-custom">
                  <AllocationBarChart
                    labels={lgaComparison.labels}
                    data={lgaComparison.data}
                    label="Total Net Allocation"
                    horizontal
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Latest records table */}
          <div className="data-card mt-4">
            <div className="card-header-custom">
              <h3>Latest Published Allocation Records</h3>
              <Link href="/allocations" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Local Government</th>
                    <th>Period</th>
                    <th>Gross Allocation</th>
                    <th>Deductions</th>
                    <th>Net Allocation</th>
                    <th>Published</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {latestRecords.map((rec) => (
                    <tr key={rec.id}>
                      <td style={{ fontWeight: 600 }}>{rec.lgaName}</td>
                      <td>
                        {rec.monthName} {rec.year}
                      </td>
                      <td>{formatNaira(rec.grossAllocation)}</td>
                      <td style={{ color: '#dc3545' }}>
                        ({formatNaira(rec.totalDeductions)})
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--accent-dark)' }}>
                        {formatNaira(rec.netAllocation)}
                      </td>
                      <td>{formatDate(rec.publishedDate)}</td>
                      <td>
                        <Link
                          href={`/allocations/${lgas.find(l => l.id === rec.lgaId)?.slug}`}
                          className="action-btn"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ====== LGA DIRECTORY ====== */}
      <section className="content-section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
            <div>
              <h2 className="section-heading mb-1">Local Government Areas</h2>
              <p className="section-subheading mb-0">
                Explore allocation details for each of the {lgas.length} LGAs in Kwara State.
              </p>
            </div>
            <div style={{ maxWidth: 280, width: '100%' }}>
              <div className="position-relative">
                <FiSearch
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#8d95a0',
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter LGAs..."
                  style={{ paddingLeft: 36 }}
                  value={lgaGridSearch}
                  onChange={(e) => setLgaGridSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row g-3">
            {filteredLGAGrid.map((lga) => {
              const latestAmount = getLatestLGAAllocation(lga.id);
              return (
                <div className="col-lg-3 col-md-4 col-sm-6" key={lga.id}>
                  <Link href={`/allocations/${lga.slug}`} className="lga-card">
                    <div className="lga-name">{lga.name}</div>
                    <div className="lga-hq">
                      <FiMapPin size={12} style={{ marginRight: 4 }} />
                      {lga.headquarters}
                    </div>
                    <div className="lga-amount-label">Latest Net Allocation</div>
                    <div className="lga-amount">{formatNairaShort(latestAmount)}</div>
                  </Link>
                </div>
              );
            })}
            {filteredLGAGrid.length === 0 && (
              <div className="col-12">
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h4>No LGAs found</h4>
                  <p>Try a different search term.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
