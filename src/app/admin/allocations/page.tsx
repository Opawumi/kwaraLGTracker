'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  allocationRecords as initialRecords,
  lgas,
  MONTHS,
  YEARS,
  AllocationRecord,
} from '@/data/demoData';
import { formatNaira, formatDate, getStatusBadgeClass, getPaginationRange } from '@/lib/utils';
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiUploadCloud,
  FiCheckCircle,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiRotateCcw,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
} from 'react-icons/fi';

export default function ManageAllocationsPage() {
  const [records, setRecords] = useState<AllocationRecord[]>(initialRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLga, setSelectedLga] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Modal state for view/edit preview
  const [activeModalRecord, setActiveModalRecord] = useState<AllocationRecord | null>(null);

  const itemsPerPage = 12;

  // Filter logic
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedLga !== 'all' && r.lgaId !== selectedLga) return false;
      if (selectedMonth !== 'all' && r.month !== parseInt(selectedMonth, 10)) return false;
      if (selectedYear !== 'all' && r.year !== parseInt(selectedYear, 10)) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          r.lgaName.toLowerCase().includes(term) ||
          r.monthName.toLowerCase().includes(term) ||
          r.year.toString().includes(term)
        );
      }
      return true;
    }).sort((a, b) => b.year - a.year || b.month - a.month || a.lgaName.localeCompare(b.lgaName));
  }, [records, selectedLga, selectedMonth, selectedYear, selectedStatus, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  // Actions
  const handleTogglePublish = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          const newStatus = r.status === 'Published' ? 'Draft' : 'Published';
          const newDate = newStatus === 'Published' ? new Date().toISOString().split('T')[0] : null;
          return { ...r, status: newStatus, publishedDate: newDate };
        }
        return r;
      })
    );
    setAlertMessage(`Record updated successfully. Status changed.`);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleDelete = (recordId: string) => {
    if (confirm('Are you sure you want to delete this allocation record? This action will be audited.')) {
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
      setAlertMessage('Allocation record was removed from database.');
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedLga('all');
    setSelectedMonth('all');
    setSelectedYear('all');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Top Heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>Manage Allocation Records</h2>
          <p className="text-muted small mb-0">Create, review, publish, and audit LGA distribution schedules.</p>
        </div>
        <div className="d-flex gap-2">
          <Link href="/admin/bulk-upload" className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1">
            <FiUploadCloud size={15} /> Bulk Upload
          </Link>
          <Link href="/admin/allocations/new" className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1">
            <FiPlus size={15} /> Add New Allocation
          </Link>
        </div>
      </div>

      {alertMessage && (
        <div className="alert alert-success alert-dismissible fade show py-2 px-3 small mb-3" role="alert">
          <FiCheckCircle className="me-2" />
          {alertMessage}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="filters-bar mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-lg-3 col-md-6">
            <label>Search LGA</label>
            <div className="position-relative">
              <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8d95a0' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: 36 }}
                placeholder="Search LGA name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <label>Local Government</label>
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
                <option key={lga.id} value={lga.id}>{lga.name}</option>
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
              {YEARS.map((y) => (
                <option key={y} value={y.toString()}>{y}</option>
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
                <option key={m} value={(idx + 1).toString()}>{m}</option>
              ))}
            </select>
          </div>

          <div className="col-lg-2 col-md-4">
            <label>Status</label>
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="Published">Published Only</option>
              <option value="Draft">Draft Only</option>
            </select>
          </div>

          <div className="col-lg-1 col-md-12">
            <button
              onClick={handleClear}
              className="btn btn-outline-secondary w-100"
              title="Reset filters"
            >
              <FiRotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Records Table */}
      <div className="data-table-wrapper">
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
          <div className="small text-muted">
            Found <strong>{filteredRecords.length}</strong> matching records
          </div>
          <div className="small text-muted">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>LGA</th>
                <th>Month</th>
                <th>Year</th>
                <th className="text-end">Gross Allocation</th>
                <th className="text-end">Deductions</th>
                <th className="text-end">Net Allocation</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-center" style={{ minWidth: 200 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-semibold">{r.lgaName}</td>
                    <td>{r.monthName}</td>
                    <td>{r.year}</td>
                    <td className="text-end font-monospace">{formatNaira(r.grossAllocation)}</td>
                    <td className="text-end font-monospace text-danger">({formatNaira(r.totalDeductions)})</td>
                    <td className="text-end font-monospace fw-bold text-success">
                      {formatNaira(r.netAllocation)}
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(r.status)}>
                        {r.status}
                      </span>
                    </td>
                    <td className="text-muted small">{r.createdDate}</td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          onClick={() => setActiveModalRecord(r)}
                          className="btn btn-outline-secondary"
                          title="View detailed breakdown"
                        >
                          <FiEye size={13} />
                        </button>
                        <button
                          onClick={() => handleTogglePublish(r.id)}
                          className={`btn ${r.status === 'Published' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          title={r.status === 'Published' ? 'Revert to Draft' : 'Publish to Public Site'}
                        >
                          {r.status === 'Published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="btn btn-outline-danger"
                          title="Delete record"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="empty-state py-5">
                      <div className="empty-icon">📂</div>
                      <h4>No Records Matching Query</h4>
                      <p>Adjust your search criteria or add new allocation records.</p>
                      <button onClick={handleClear} className="btn btn-sm btn-outline-primary mt-2">
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="table-footer">
            <div className="results-info">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
            </div>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                    <FiChevronLeft />
                  </button>
                </li>
                {getPaginationRange(currentPage, totalPages).map((p, idx) => {
                  if (p === '...') {
                    return <li key={`e-${idx}`} className="page-item disabled"><span className="page-link">...</span></li>;
                  }
                  return (
                    <li key={`p-${p}`} className={`page-item ${currentPage === p ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(Number(p))}>{p}</button>
                    </li>
                  );
                })}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                    <FiChevronRight />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Detail Inspection Modal */}
      {activeModalRecord && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold text-primary">
                  Allocation Voucher Details — {activeModalRecord.lgaName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setActiveModalRecord(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span className="text-muted small">Period: </span>
                    <strong>{activeModalRecord.monthName} {activeModalRecord.year}</strong>
                  </div>
                  <div>
                    <span className={getStatusBadgeClass(activeModalRecord.status)}>
                      {activeModalRecord.status}
                    </span>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded border">
                      <div className="text-muted small">Statutory Allocation</div>
                      <div className="fw-bold font-monospace fs-5">{formatNaira(activeModalRecord.statutoryAllocation)}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded border">
                      <div className="text-muted small">VAT Distribution Share</div>
                      <div className="fw-bold font-monospace fs-5">{formatNaira(activeModalRecord.vatAllocation)}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded border">
                      <div className="text-muted small">Excess Crude / Augmentation</div>
                      <div className="fw-bold font-monospace fs-5">{formatNaira(activeModalRecord.excessCrude)}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded border">
                      <div className="text-muted small">Other Revenue Components</div>
                      <div className="fw-bold font-monospace fs-5">{formatNaira(activeModalRecord.otherRevenue)}</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 my-3 bg-white border border-2 rounded">
                  <div className="d-flex justify-content-between py-1">
                    <span className="text-muted">Gross Calculated Allocation:</span>
                    <strong className="font-monospace">{formatNaira(activeModalRecord.grossAllocation)}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 text-danger">
                    <span>Total Deductions & Charges:</span>
                    <strong className="font-monospace">({formatNaira(activeModalRecord.totalDeductions)})</strong>
                  </div>
                  <div className="d-flex justify-content-between py-2 border-top mt-2 text-success">
                    <span className="fw-bold fs-6">Net Disbursed Allocation:</span>
                    <span className="fw-bold font-monospace fs-5">{formatNaira(activeModalRecord.netAllocation)}</span>
                  </div>
                </div>

                {activeModalRecord.notes && (
                  <div className="alert alert-secondary py-2 small mb-0">
                    <strong>Administrative Note:</strong> {activeModalRecord.notes}
                  </div>
                )}
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveModalRecord(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${activeModalRecord.status === 'Published' ? 'btn-warning' : 'btn-success'}`}
                  onClick={() => {
                    handleTogglePublish(activeModalRecord.id);
                    setActiveModalRecord(null);
                  }}
                >
                  {activeModalRecord.status === 'Published' ? 'Unpublish Record' : 'Publish to Public'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
