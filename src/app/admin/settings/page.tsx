'use client';

import { useState } from 'react';
import { FiSave, FiCheckCircle, FiShield, FiBell, FiGlobe } from 'react-icons/fi';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('kwaraLGTracker');
  const [requireApproval, setRequireApproval] = useState(true);
  const [notifyOnUpload, setNotifyOnUpload] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('₦');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>Platform Governance & System Settings</h2>
          <p className="text-muted small mb-0">Configure publication workflows, threshold warnings, and institutional parameters.</p>
        </div>
      </div>

      {saved && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 small mb-4">
          <FiCheckCircle size={16} /> Configuration changes saved successfully.
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="data-card p-4 mb-4">
              <h5 className="fw-bold text-primary mb-3 fs-6 d-flex align-items-center gap-2">
                <FiGlobe /> General Public Portal Parameters
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Platform Official Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Currency Representation</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ maxWidth: 120 }}
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="data-card p-4 mb-4">
              <h5 className="fw-bold text-primary mb-3 fs-6 d-flex align-items-center gap-2">
                <FiShield /> Fiscal Governance & Dual-Approval Policy
              </h5>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="requireApproval"
                  checked={requireApproval}
                  onChange={(e) => setRequireApproval(e.target.checked)}
                />
                <label className="form-check-label small fw-semibold" htmlFor="requireApproval">
                  Enforce Senior Auditor Approval Before Public Release
                </label>
                <div className="text-muted small">
                  When enabled, records created by Data Entry personnel require explicit authorization by a Super Admin or Auditor.
                </div>
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="notifyOnUpload"
                  checked={notifyOnUpload}
                  onChange={(e) => setNotifyOnUpload(e.target.checked)}
                />
                <label className="form-check-label small fw-semibold" htmlFor="notifyOnUpload">
                  Dispatch Institutional Email Alerts on Schedule Publishing
                </label>
                <div className="text-muted small">
                  Automatically alert designated council treasurers when verified allocations are published.
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2">
              <FiSave /> Save Configuration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
