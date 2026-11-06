'use client';

import { useState } from 'react';
import { supportingDocuments as initialDocs, SupportingDocument } from '@/data/demoData';
import { formatDate } from '@/lib/utils';
import {
  FiFolder,
  FiUploadCloud,
  FiFileText,
  FiTrash2,
  FiDownload,
  FiSearch,
  FiCheckCircle,
} from 'react-icons/fi';

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<SupportingDocument[]>(initialDocs);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('PDF');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const filteredDocs = docs.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this supporting document?')) {
      setDocs((prev) => prev.filter((d) => d.id !== id));
      setAlertMsg('Document removed.');
      setTimeout(() => setAlertMsg(null), 3000);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;

    const newDoc: SupportingDocument = {
      id: `doc-${Date.now()}`,
      name: newDocName.endsWith('.pdf') || newDocName.endsWith('.xlsx') ? newDocName : `${newDocName}.${newDocType.toLowerCase()}`,
      type: newDocType,
      size: '1.8 MB',
      uploadedDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'admin@kwara.gov.ng',
    };

    setDocs([newDoc, ...docs]);
    setShowUploadModal(false);
    setNewDocName('');
    setAlertMsg('Supporting document successfully uploaded and indexed.');
    setTimeout(() => setAlertMsg(null), 3000);
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>Official Supporting Documents Repository</h2>
          <p className="text-muted small mb-0">Manage certified FAAC breakdown notices, warrants, and audit schedules.</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
        >
          <FiUploadCloud size={16} /> Upload New Document
        </button>
      </div>

      {alertMsg && (
        <div className="alert alert-success py-2 px-3 small mb-3">
          <FiCheckCircle className="me-2" /> {alertMsg}
        </div>
      )}

      {/* Search Bar */}
      <div className="filters-bar mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label>Search Document Title or Administrator</label>
            <div className="position-relative">
              <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8d95a0' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: 36 }}
                placeholder="e.g. FAAC_July, VAT_Distribution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="data-table-wrapper">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Document Title</th>
                <th>Type</th>
                <th>File Size</th>
                <th>Date Uploaded</th>
                <th>Uploaded By</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <FiFileText className="text-primary" size={18} />
                      <span className="fw-semibold">{doc.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">{doc.type}</span>
                  </td>
                  <td className="text-muted small">{doc.size}</td>
                  <td>{formatDate(doc.uploadedDate)}</td>
                  <td className="small text-muted">{doc.uploadedBy}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-secondary me-1 py-1"
                      onClick={() => alert(`Downloading verified document: ${doc.name}`)}
                      title="Download document"
                    >
                      <FiDownload size={13} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger py-1"
                      onClick={() => handleDelete(doc.id)}
                      title="Delete document"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    No supporting documents match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleUpload}>
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold text-primary">Upload Supporting Document</h5>
                  <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Document Title / Reference *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. FAAC_August_2026_Schedule.pdf"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Document Format</label>
                    <select
                      className="form-select"
                      value={newDocType}
                      onChange={(e) => setNewDocType(e.target.value)}
                    >
                      <option value="PDF">PDF Document</option>
                      <option value="Excel">Excel Spreadsheet (.xlsx)</option>
                      <option value="CSV">CSV Data File</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select File From Computer *</label>
                    <input type="file" className="form-control" required />
                    <div className="form-text small">Max upload size: 15MB</div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowUploadModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Upload & Attach
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
