'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { lgas, publishedRecords, MONTHS, YEARS } from '@/data/demoData';
import { formatNaira, formatDate, getPaginationRange } from '@/lib/utils';
import { FiSearch, FiFilter, FiDownload, FiRotateCcw, FiChevronRight, FiChevronLeft } from 'react-icons/fi';

export default function AllocationsPage() {
  const [selectedLga, setSelectedLga] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Filter records
  const filteredRecords = useMemo(() => {
    return publishedRecords.filter((rec) => {
      // LGA filter
      if (selectedLga !== 'all' && rec.lgaId !== selectedLga) {
        return false;
      }
      // Month filter
      if (selectedMonth !== 'all' && rec.month !== parseInt(selectedMonth, 10)) {
        return false;
      }
      // Year filter
      if (selectedYear !== 'all' && rec.year !== parseInt(selectedYear, 10)) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesLga = rec.lgaName.toLowerCase().includes(term);
        const matchesMonth = rec.monthName.toLowerCase().includes(term);
        const matchesYear = rec.year.toString().includes(term);
        if (!matchesLga && !matchesMonth && !matchesYear) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => b.year - a.year || b.month - a.month || a.lgaName.localeCompare(b.lgaName));
  }, [selectedLga, selectedMonth, selectedYear, searchTerm]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRecords, currentPage]);

  const handleClearFilters = () => {
    setSelectedLga('all');
    setSelectedMonth('all');
    setSelectedYear('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Export to CSV simulation
  const handleExportCSV = () => {
    const headers = ['Local Government', 'State', 'Month', 'Year', 'Gross Allocation (NGN)', 'Total Deductions (NGN)', 'Net Allocation (NGN)', 'Published Date'];
    const rows = filteredRecords.map((r) => [
      r.lgaName,
      r.state,
      r.monthName,
      r.year,
      r.grossAllocation,
      r.totalDeductions,
      r.netAllocation,
      r.publishedDate || 'N/A'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kwara_lga_allocations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PublicLayout>
      {/* Header */}
      <section className="page-header">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Allocations</li>
            </ol>
          </nav>
          <h1>Local Government Allocations</h1>
          <p>Browse, filter and audit official monthly distribution records across all 16 LGAs.</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-4">
        {/* Filters Card */}
        <div className="filters-bar mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-lg-3 col-md-6">
              <label>Search LGA or Keyword</label>
              <div className="position-relative">
                <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8d95a0' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: 36 }}
                  placeholder="e.g. Ilorin, Offa, July..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <label>Local Government Area</label>
              <select
                className="form-select"
                value={selectedLga}
                onChange={(e) => {
                  setSelectedLga(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All LGAs ({lgas.length})</option>
                {lgas.map((lga) => (
                  <option key={lga.id} value={lga.id}>
                    {lga.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-2 col-md-4">
              <label>Year</label>
              <select
                className="form-select"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Years</option>
                {YEARS.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-2 col-md-4">
              <label>Month</label>
              <select
                className="form-select"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Months</option>
                {MONTHS.map((m, idx) => (
                  <option key={m} value={(idx + 1).toString()}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-2 col-md-4 d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-1"
                onClick={handleClearFilters}
                title="Clear all filters"
              >
                <FiRotateCcw size={14} /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar: Counter & Export */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div className="text-secondary small">
            Showing <strong>{filteredRecords.length}</strong> published allocation record{filteredRecords.length === 1 ? '' : 's'}
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={handleExportCSV}
              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
              disabled={filteredRecords.length === 0}
            >
              <FiDownload size={14} /> Export to CSV
            </button>
          </div>
        </div>

        {/* Records Table */}
        <div className="data-table-wrapper">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Local Government</th>
                  <th>State</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th className="text-end">Gross Allocation</th>
                  <th className="text-end">Deductions</th>
                  <th className="text-end">Net Allocation</th>
                  <th>Publication Date</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map((rec) => {
                    const lgaSlug = lgas.find((l) => l.id === rec.lgaId)?.slug || 'asa';
                    return (
                      <tr key={rec.id}>
                        <td>
                          <Link
                            href={`/allocations/${lgaSlug}`}
                            className="fw-semibold text-decoration-none text-dark"
                          >
                            {rec.lgaName}
                          </Link>
                        </td>
                        <td><span className="badge bg-light text-dark border">{rec.state}</span></td>
                        <td>{rec.monthName}</td>
                        <td>{rec.year}</td>
                        <td className="text-end font-monospace">{formatNaira(rec.grossAllocation)}</td>
                        <td className="text-end font-monospace text-danger">({formatNaira(rec.totalDeductions)})</td>
                        <td className="text-end font-monospace fw-bold text-success">
                          {formatNaira(rec.netAllocation)}
                        </td>
                        <td>{formatDate(rec.publishedDate)}</td>
                        <td className="text-center">
                          <Link
                            href={`/allocations/${lgaSlug}`}
                            className="btn btn-sm btn-outline-primary py-1 px-3"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9}>
                      <div className="empty-state py-5">
                        <div className="empty-icon">📁</div>
                        <h4>No Allocation Records Found</h4>
                        <p className="text-muted">
                          No allocation records match your selected filter criteria. Try resetting the filters or broadening your search.
                        </p>
                        <button onClick={handleClearFilters} className="btn btn-sm btn-primary mt-3">
                          Reset All Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="table-footer">
              <div className="results-info">
                Page {currentPage} of {totalPages}
              </div>
              <nav aria-label="Allocations pagination">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      aria-label="Previous"
                    >
                      <FiChevronLeft />
                    </button>
                  </li>
                  {getPaginationRange(currentPage, totalPages).map((p, idx) => {
                    if (p === '...') {
                      return (
                        <li key={`ellipsis-${idx}`} className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      );
                    }
                    return (
                      <li
                        key={`page-${p}`}
                        className={`page-item ${currentPage === p ? 'active' : ''}`}
                      >
                        <button className="page-link" onClick={() => setCurrentPage(Number(p))}>
                          {p}
                        </button>
                      </li>
                    );
                  })}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      aria-label="Next"
                    >
                      <FiChevronRight />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
