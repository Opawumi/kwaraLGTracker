'use client';

import { useState } from 'react';
import { auditLogs as initialLogs, AuditLog } from '@/data/demoData';
import {
  FiActivity,
  FiSearch,
  FiFilter,
  FiDownload,
  FiClock,
  FiShield,
  FiRotateCcw,
} from 'react-icons/fi';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('all');

  const filteredLogs = logs.filter((log) => {
    if (selectedAdmin !== 'all' && log.administrator !== selectedAdmin) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        log.action.toLowerCase().includes(term) ||
        log.recordAffected.toLowerCase().includes(term) ||
        log.administrator.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const admins = Array.from(new Set(logs.map((l) => l.administrator)));

  const handleExportAudit = () => {
    const headers = ['Log ID', 'Administrator', 'Action', 'Record Affected', 'Date & Time', 'Previous Value', 'Updated Value'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.administrator,
      `"${l.action}"`,
      `"${l.recordAffected}"`,
      l.dateTime,
      `"${l.previousValue || ''}"`,
      `"${l.updatedValue || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kwara_audit_trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>System Audit Trail & Security Logs</h2>
          <p className="text-muted small mb-0">Immutable compliance logs tracking all creation, publication, and modification events.</p>
        </div>
        <button
          onClick={handleExportAudit}
          className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
        >
          <FiDownload size={14} /> Export Audit Log (CSV)
        </button>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-5">
            <label>Search Action or Affected Entity</label>
            <div className="position-relative">
              <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8d95a0' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: 36 }}
                placeholder="e.g. Published, Offa, Delete..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-5">
            <label>Filter by Administrator</label>
            <select
              className="form-select"
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
            >
              <option value="all">All Administrators</option>
              {admins.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedAdmin('all');
              }}
              className="btn btn-outline-secondary w-100"
            >
              <FiRotateCcw size={14} className="me-1" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="data-table-wrapper">
        <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
          <span className="small text-muted">
            Displaying <strong>{filteredLogs.length}</strong> audited compliance events
          </span>
          <span className="badge bg-secondary-subtle text-secondary border">
            <FiShield className="me-1" /> Tamper-Evident Ledger
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Administrator</th>
                <th>Action Performed</th>
                <th>Record Affected</th>
                <th>Previous Value</th>
                <th>Updated Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-monospace small text-muted text-nowrap">
                    <FiClock className="me-1" size={12} />
                    {log.dateTime}
                  </td>
                  <td className="fw-semibold small">{log.administrator}</td>
                  <td>
                    <span className="badge bg-light text-primary border">
                      {log.action}
                    </span>
                  </td>
                  <td className="fw-semibold">{log.recordAffected}</td>
                  <td>
                    {log.previousValue ? (
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                        {log.previousValue}
                      </span>
                    ) : (
                      <span className="text-muted small">—</span>
                    )}
                  </td>
                  <td>
                    {log.updatedValue ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle">
                        {log.updatedValue}
                      </span>
                    ) : (
                      <span className="text-muted small">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    No audit records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
