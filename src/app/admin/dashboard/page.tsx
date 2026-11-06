'use client';

import Link from 'next/link';
import {
  allocationRecords,
  publishedRecords,
  draftRecords,
  lgas,
  auditLogs,
} from '@/data/demoData';
import { formatNaira, formatDate, getStatusBadgeClass } from '@/lib/utils';
import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiUploadCloud,
  FiPlus,
  FiActivity,
  FiArrowRight,
  FiTrendingUp,
} from 'react-icons/fi';

export default function AdminDashboardPage() {
  const totalRecords = allocationRecords.length;
  const publishedCount = publishedRecords.length;
  const draftCount = draftRecords.length;
  const totalLgasCovered = lgas.length;
  const latestUploadDate = '22 Sep 2026';

  // Recent 6 records
  const recentRecords = [...allocationRecords]
    .sort((a, b) => b.year - a.year || b.month - a.month)
    .slice(0, 6);

  return (
    <div>
      {/* Top Banner & Quick Actions */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>Executive Allocation Dashboard</h2>
          <p className="text-muted small mb-0">Overview of FAAC disbursements, draft workflows, and publication audit trails.</p>
        </div>
        <div className="d-flex gap-2">
          <Link href="/admin/bulk-upload" className="btn btn-outline-primary d-inline-flex align-items-center gap-1">
            <FiUploadCloud size={16} /> Bulk Upload
          </Link>
          <Link href="/admin/allocations/new" className="btn btn-primary d-inline-flex align-items-center gap-1">
            <FiPlus size={16} /> Add Single Allocation
          </Link>
        </div>
      </div>

      {/* 5 Primary Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl col-md-4 col-sm-6">
          <div className="stat-card h-100">
            <div className="stat-icon blue">
              <FiFileText />
            </div>
            <div className="stat-label">Total Records</div>
            <div className="stat-value">{totalRecords}</div>
            <div className="stat-subtitle">Across all periods</div>
          </div>
        </div>

        <div className="col-xl col-md-4 col-sm-6">
          <div className="stat-card h-100">
            <div className="stat-icon green">
              <FiCheckCircle />
            </div>
            <div className="stat-label">Published Records</div>
            <div className="stat-value text-success">{publishedCount}</div>
            <div className="stat-subtitle">Publicly accessible</div>
          </div>
        </div>

        <div className="col-xl col-md-4 col-sm-6">
          <div className="stat-card h-100">
            <div className="stat-icon orange">
              <FiClock />
            </div>
            <div className="stat-label">Draft Records</div>
            <div className="stat-value text-warning">{draftCount}</div>
            <div className="stat-subtitle">Pending verification</div>
          </div>
        </div>

        <div className="col-xl col-md-6 col-sm-6">
          <div className="stat-card h-100">
            <div className="stat-icon purple">
              <FiMapPin />
            </div>
            <div className="stat-label">LGAs Covered</div>
            <div className="stat-value">{totalLgasCovered} / 16</div>
            <div className="stat-subtitle">100% State Coverage</div>
          </div>
        </div>

        <div className="col-xl col-md-6 col-sm-12">
          <div className="stat-card h-100">
            <div className="stat-icon green">
              <FiUploadCloud />
            </div>
            <div className="stat-label">Latest Upload</div>
            <div className="stat-value" style={{ fontSize: '1.25rem' }}>{latestUploadDate}</div>
            <div className="stat-subtitle">September 2026 Batch</div>
          </div>
        </div>
      </div>

      {/* Grid: Recent Allocation Records + Recent Audit Activities */}
      <div className="row g-4">
        {/* Recent Allocation Records */}
        <div className="col-lg-8">
          <div className="data-card h-100">
            <div className="card-header-custom">
              <div className="d-flex align-items-center gap-2">
                <FiTrendingUp className="text-primary" />
                <h3>Recently Added Allocation Records</h3>
              </div>
              <Link href="/admin/allocations" className="btn btn-sm btn-outline-secondary">
                View All Records
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>LGA</th>
                    <th>Period</th>
                    <th className="text-end">Net Allocation</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords.map((rec) => (
                    <tr key={rec.id}>
                      <td className="fw-semibold">{rec.lgaName}</td>
                      <td>{rec.monthName} {rec.year}</td>
                      <td className="text-end font-monospace fw-semibold text-dark">
                        {formatNaira(rec.netAllocation)}
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(rec.status)}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="text-muted small">{rec.createdDate}</td>
                      <td className="text-center">
                        <Link
                          href={`/admin/allocations?search=${rec.lgaName}`}
                          className="btn btn-sm btn-outline-primary py-0 px-2"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Audit Log / Activity Feed */}
        <div className="col-lg-4">
          <div className="data-card h-100">
            <div className="card-header-custom">
              <div className="d-flex align-items-center gap-2">
                <FiActivity className="text-primary" />
                <h3>Recent System Activity</h3>
              </div>
              <Link href="/admin/audit-logs" className="small text-decoration-none">
                Audit Trail
              </Link>
            </div>
            <div className="card-body-custom p-0">
              <div className="list-group list-group-flush">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="list-group-item p-3">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <span className="fw-semibold small text-primary">{log.action}</span>
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                        {log.dateTime.split(' ')[1]}
                      </span>
                    </div>
                    <div className="text-muted small mb-1">{log.recordAffected}</div>
                    <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.75rem' }}>
                      <span className="text-muted">{log.administrator}</span>
                      {log.updatedValue && (
                        <span className="badge bg-light text-dark border">
                          {log.updatedValue}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 bg-light border-top text-center">
              <Link href="/admin/audit-logs" className="btn btn-sm btn-link text-decoration-none d-inline-flex align-items-center gap-1">
                View Full Regulatory Audit Logs <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
