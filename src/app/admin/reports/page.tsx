'use client';

import { useState } from 'react';
import { publishedRecords, draftRecords, lgas, YEARS } from '@/data/demoData';
import { formatNaira, formatNairaShort } from '@/lib/utils';
import { FiDownload, FiBarChart2, FiPrinter, FiCheckCircle } from 'react-icons/fi';

export default function AdminReportsPage() {
  const [selectedYear, setSelectedYear] = useState('2026');

  const records = publishedRecords.filter(
    (r) => selectedYear === 'all' || r.year === parseInt(selectedYear, 10)
  );

  const totalGross = records.reduce((s, r) => s + r.grossAllocation, 0);
  const totalDeductions = records.reduce((s, r) => s + r.totalDeductions, 0);
  const totalNet = records.reduce((s, r) => s + r.netAllocation, 0);

  const handleExport = () => {
    window.print();
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>Administrative Financial Reports & Reconciliation</h2>
          <p className="text-muted small mb-0">Audited fiscal summaries and state-wide JAAC disbursement reconciliation reports.</p>
        </div>
        <button onClick={handleExport} className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1">
          <FiPrinter size={15} /> Print / Export Report
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-label">Total Gross FAAC Receipts</div>
            <div className="stat-value">{formatNairaShort(totalGross)}</div>
            <div className="stat-subtitle">{formatNaira(totalGross)}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-label">Total Contractual Deductions</div>
            <div className="stat-value text-danger">({formatNairaShort(totalDeductions)})</div>
            <div className="stat-subtitle">Debt servicing & statutory offsets</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-label">Net Disbursed to Councils</div>
            <div className="stat-value text-success">{formatNairaShort(totalNet)}</div>
            <div className="stat-subtitle">{formatNaira(totalNet)}</div>
          </div>
        </div>
      </div>

      <div className="data-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold fs-6 text-primary mb-0">Fiscal Summary Statement</h4>
          <select
            className="form-select form-select-sm"
            style={{ width: 140 }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {YEARS.map((y) => (
              <option key={y} value={y.toString()}>{y} Fiscal Year</option>
            ))}
          </select>
        </div>
        <p className="small text-muted mb-4">
          Official reconciliation statement prepared for the Kwara State Ministry of Local Government & Chieftaincy Affairs.
        </p>

        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>LGA</th>
                <th className="text-end">Statutory Total</th>
                <th className="text-end">VAT Total</th>
                <th className="text-end">Gross Total</th>
                <th className="text-end">Deductions</th>
                <th className="text-end">Net Disbursed</th>
              </tr>
            </thead>
            <tbody>
              {lgas.map((lga) => {
                const lgaRecs = records.filter((r) => r.lgaId === lga.id);
                const stat = lgaRecs.reduce((s, r) => s + r.statutoryAllocation, 0);
                const vat = lgaRecs.reduce((s, r) => s + r.vatAllocation, 0);
                const gross = lgaRecs.reduce((s, r) => s + r.grossAllocation, 0);
                const ded = lgaRecs.reduce((s, r) => s + r.totalDeductions, 0);
                const net = lgaRecs.reduce((s, r) => s + r.netAllocation, 0);
                return (
                  <tr key={lga.id}>
                    <td className="fw-semibold">{lga.name}</td>
                    <td className="text-end font-monospace">{formatNairaShort(stat)}</td>
                    <td className="text-end font-monospace">{formatNairaShort(vat)}</td>
                    <td className="text-end font-monospace">{formatNairaShort(gross)}</td>
                    <td className="text-end font-monospace text-danger">({formatNairaShort(ded)})</td>
                    <td className="text-end font-monospace fw-bold text-success">{formatNairaShort(net)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
