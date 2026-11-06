'use client';

import { useState, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { lgas, MONTHS, YEARS } from '@/data/demoData';
import { formatNaira } from '@/lib/utils';
import {
  FiCheckCircle,
  FiArrowLeft,
  FiSave,
  FiSend,
  FiUpload,
  FiInfo,
  FiAlertCircle,
} from 'react-icons/fi';

export default function AddAllocationPage() {
  const router = useRouter();

  // Form states
  const [stateName] = useState('Kwara');
  const [lgaId, setLgaId] = useState(lgas[0].id);
  const [month, setMonth] = useState('10'); // October
  const [year, setYear] = useState('2026');

  // Revenue components
  const [statutory, setStatutory] = useState<number>(120000000);
  const [vat, setVat] = useState<number>(65000000);
  const [excessCrude, setExcessCrude] = useState<number>(15000000);
  const [otherRevenue, setOtherRevenue] = useState<number>(8500000);

  // Deductions
  const [penaltyDeduction, setPenaltyDeduction] = useState<number>(2000000);
  const [loanDeduction, setLoanDeduction] = useState<number>(6000000);
  const [otherDeductions, setOtherDeductions] = useState<number>(1500000);

  // Notes & file
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const grossAllocation = (statutory || 0) + (vat || 0) + (excessCrude || 0) + (otherRevenue || 0);
  const totalDeductions = (penaltyDeduction || 0) + (loanDeduction || 0) + (otherDeductions || 0);
  const netAllocation = grossAllocation - totalDeductions;

  const handleSubmit = (action: 'Draft' | 'Published') => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        `Allocation record successfully saved as ${action.toUpperCase()}! Redirecting to allocation management...`
      );
      setTimeout(() => {
        router.push('/admin/allocations');
      }, 1500);
    }, 600);
  };

  return (
    <div>
      {/* Breadcrumb & Navigation */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <Link href="/admin/allocations" className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1">
          <FiArrowLeft /> Back to Manage Allocations
        </Link>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>New Allocation Voucher Entry</h2>
          <p className="text-muted small mb-0">Enter authenticated FAAC disbursement breakdown and review live net receipts.</p>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-3 px-4 mb-4 shadow-sm" role="alert">
          <FiCheckCircle size={20} />
          <div>{successMessage}</div>
        </div>
      )}

      <div className="row g-4">
        {/* Left column: Entry Form */}
        <div className="col-lg-8">
          <div className="data-card p-4">
            <h4 className="fw-bold text-primary mb-3 fs-6">1. Local Government & Period Specification</h4>
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-secondary">State</label>
                <input type="text" className="form-control" value={stateName} disabled readOnly />
              </div>

              <div className="col-md-5">
                <label className="form-label small fw-semibold text-secondary">Local Government Area *</label>
                <select
                  className="form-select"
                  value={lgaId}
                  onChange={(e) => setLgaId(e.target.value)}
                  required
                >
                  {lgas.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} (HQ: {l.headquarters})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-semibold text-secondary">Month *</label>
                <select
                  className="form-select"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={(i + 1).toString()}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-semibold text-secondary">Year *</label>
                <select
                  className="form-select"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y.toString()}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="my-4 text-muted" />

            <h4 className="fw-bold text-primary mb-3 fs-6">2. Revenue Inflow Components (Gross Allocation)</h4>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-secondary">Statutory Allocation (₦) *</label>
                <div className="input-group">
                  <span className="input-group-text">₦</span>
                  <input
                    type="number"
                    className="form-control font-monospace"
                    value={statutory}
                    onChange={(e) => setStatutory(Number(e.target.value))}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-secondary">VAT Allocation Share (₦) *</label>
                <div className="input-group">
                  <span className="input-group-text">₦</span>
                  <input
                    type="number"
                    className="form-control font-monospace"
                    value={vat}
                    onChange={(e) => setVat(Number(e.target.value))}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-secondary">Excess Crude / Augmentation (₦)</label>
                <div className="input-group">
                  <span className="input-group-text">₦</span>
                  <input
                    type="number"
                    className="form-control font-monospace"
                    value={excessCrude}
                    onChange={(e) => setExcessCrude(Number(e.target.value))}
                    min="0"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-secondary">Other Revenue Components (₦)</label>
                <div className="input-group">
                  <span className="input-group-text">₦</span>
                  <input
                    type="number"
                    className="form-control font-monospace"
                    value={otherRevenue}
                    onChange={(e) => setOtherRevenue(Number(e.target.value))}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <hr className="my-4 text-muted" />

            <h4 className="fw-bold text-primary mb-3 fs-6">3. Authorized Statutory Deductions</h4>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-secondary">Statutory / Penalty Deductions (₦)</label>
                <div className="input-group">
                  <span className="input-group-text text-danger">₦</span>
                  <input
                    type="number"
                    className="form-control font-monospace text-danger"
                    value={penaltyDeduction}
                    onChange={(e) => setPenaltyDeduction(Number(e.target.value))}
                    min="0"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold text-secondary">External / Internal Loan Servicing (₦)</label>
                <div className="input-group">
                  <span className="input-group-text text-danger">₦</span>
                  <input
                    type="number"
                    className="form-control font-monospace text-danger"
                    value={loanDeduction}
                    onChange={(e) => setLoanDeduction(Number(e.target.value))}
                    min="0"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold text-secondary">Other Authorized Deductions (₦)</label>
                <div className="input-group">
                  <span className="input-group-text text-danger">₦</span>
                  <input
                    type="number"
                    className="form-control font-monospace text-danger"
                    value={otherDeductions}
                    onChange={(e) => setOtherDeductions(Number(e.target.value))}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <hr className="my-4 text-muted" />

            <h4 className="fw-bold text-primary mb-3 fs-6">4. Supporting Document & Audit Notes</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-secondary">Upload Supporting Voucher / PDF</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.xlsx,.csv,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFileName(e.target.files[0].name);
                    }
                  }}
                />
                <div className="form-text small">Accepted formats: PDF, Excel, CSV (Max 10MB)</div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-secondary">Internal Verification Notes</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="e.g. Certified by Office of the Accountant-General, Batch 10..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Live Calculated Voucher Summary & Actions */}
        <div className="col-lg-4">
          <div className="data-card p-4 position-sticky" style={{ top: 90 }}>
            <h4 className="fw-bold text-primary mb-3 fs-6 d-flex align-items-center gap-2">
              <FiInfo /> Live Financial Reconciliation
            </h4>

            <div className="p-3 bg-light rounded border mb-3">
              <div className="small text-muted mb-1">Target Entity</div>
              <div className="fw-bold text-dark fs-6">
                {lgas.find((l) => l.id === lgaId)?.name} Local Government Area
              </div>
              <div className="small text-muted">
                {MONTHS[parseInt(month, 10) - 1]} {year} Distribution
              </div>
            </div>

            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-secondary small">Gross Allocation:</span>
              <strong className="font-monospace">{formatNaira(grossAllocation)}</strong>
            </div>

            <div className="d-flex justify-content-between py-2 border-bottom text-danger">
              <span className="small">Total Deductions:</span>
              <strong className="font-monospace">({formatNaira(totalDeductions)})</strong>
            </div>

            <div className="p-3 my-3 bg-success-subtle border border-success rounded">
              <div className="small text-success-emphasis fw-semibold">Final Calculated Net Disbursable</div>
              <div className="fs-4 fw-bold font-monospace text-success mt-1">
                {formatNaira(netAllocation)}
              </div>
            </div>

            {fileName && (
              <div className="small text-muted mb-3 d-flex align-items-center gap-1">
                <FiUpload /> Attached: <strong>{fileName}</strong>
              </div>
            )}

            {/* Actions */}
            <div className="d-grid gap-2">
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                onClick={() => handleSubmit('Published')}
                disabled={isSubmitting || netAllocation < 0}
              >
                <FiSend /> Publish to Public Website
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                onClick={() => handleSubmit('Draft')}
                disabled={isSubmitting}
              >
                <FiSave /> Save as Private Draft
              </button>

              <Link href="/admin/allocations" className="btn btn-link text-muted small text-center text-decoration-none mt-1">
                Cancel & Return
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
