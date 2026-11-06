'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { lgas, MONTHS } from '@/data/demoData';
import { formatNaira } from '@/lib/utils';
import {
  FiUploadCloud,
  FiFileText,
  FiDownload,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiArrowRight,
  FiRefreshCw,
} from 'react-icons/fi';

interface ParsedRecord {
  id: string;
  lgaName: string;
  month: string;
  year: number;
  grossAllocation: number;
  deductions: number;
  netAllocation: number;
  status: 'Valid' | 'Warning' | 'Error';
  validationMessage: string;
}

export default function BulkUploadPage() {
  const router = useRouter();
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewRecords, setPreviewRecords] = useState<ParsedRecord[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);

  // Sample Excel/CSV template download
  const handleDownloadTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'LGA_Name,State,Month,Year,Statutory_Allocation,VAT_Allocation,Excess_Crude,Other_Revenue,Total_Deductions\n' +
      'Ilorin West,Kwara,10,2026,145000000,75000000,12000000,5000000,8500000\n' +
      'Offa,Kwara,10,2026,110000000,58000000,9000000,4000000,6200000\n' +
      'Asa,Kwara,10,2026,105000000,52000000,8000000,3500000,5500000\n' +
      'Baruten,Kwara,10,2026,130000000,68000000,10500000,4500000,7800000';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'kwara_lga_bulk_allocation_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulate file selection and automated validation parsing
  const processFile = (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);

          // Populate realistic validation preview
          const simulatedParsed: ParsedRecord[] = [
            {
              id: 'imp-1',
              lgaName: 'Ilorin West',
              month: 'October',
              year: 2026,
              grossAllocation: 237000000,
              deductions: 8500000,
              netAllocation: 228500000,
              status: 'Valid',
              validationMessage: 'Verified against LGA registry.',
            },
            {
              id: 'imp-2',
              lgaName: 'Offa',
              month: 'October',
              year: 2026,
              grossAllocation: 181000000,
              deductions: 6200000,
              netAllocation: 174800000,
              status: 'Valid',
              validationMessage: 'Verified against LGA registry.',
            },
            {
              id: 'imp-3',
              lgaName: 'Asa',
              month: 'October',
              year: 2026,
              grossAllocation: 168500000,
              deductions: 5500000,
              netAllocation: 163000000,
              status: 'Warning',
              validationMessage: 'Potential duplicate: October 2026 entry already exists in draft.',
            },
            {
              id: 'imp-4',
              lgaName: 'Baruten',
              month: 'October',
              year: 2026,
              grossAllocation: 213000000,
              deductions: 7800000,
              netAllocation: 205200000,
              status: 'Valid',
              validationMessage: 'Verified against LGA registry.',
            },
            {
              id: 'imp-5',
              lgaName: 'Edu',
              month: 'October',
              year: 2026,
              grossAllocation: 160000000,
              deductions: 165000000,
              netAllocation: -5000000,
              status: 'Error',
              validationMessage: 'Calculation Error: Deductions exceed Gross Allocation (negative net figure).',
            },
            {
              id: 'imp-6',
              lgaName: 'Ilorin South',
              month: 'October',
              year: 2026,
              grossAllocation: 195000000,
              deductions: 7200000,
              netAllocation: 187800000,
              status: 'Valid',
              validationMessage: 'Verified against LGA registry.',
            },
          ];
          setPreviewRecords(simulatedParsed);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = (action: 'Published' | 'Draft') => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setImportSuccess(true);
      setTimeout(() => {
        router.push('/admin/allocations');
      }, 1800);
    }, 800);
  };

  const validCount = previewRecords.filter((r) => r.status === 'Valid').length;
  const warningCount = previewRecords.filter((r) => r.status === 'Warning').length;
  const errorCount = previewRecords.filter((r) => r.status === 'Error').length;

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>Bulk Upload Allocation Schedules</h2>
          <p className="text-muted small mb-0">
            Import monthly FAAC distribution spreadsheets for rapid ingestion, validation, and stage publishing.
          </p>
        </div>
        <button
          onClick={handleDownloadTemplate}
          className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
        >
          <FiDownload size={14} /> Download Excel/CSV Template
        </button>
      </div>

      {importSuccess && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-3 px-4 mb-4 shadow-sm">
          <FiCheckCircle size={20} />
          <div>
            <strong>Import Successful!</strong> 5 verified allocation records have been added to the database. Redirecting...
          </div>
        </div>
      )}

      {/* Upload Zone */}
      {!previewRecords.length && (
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div
              className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <FiUploadCloud className="upload-icon" />
              <h4>Drag and Drop Allocation Spreadsheet</h4>
              <p>Supports .xlsx, .xls and .csv formatted distribution sheets.</p>
              <label className="btn btn-primary px-4 cursor-pointer">
                Browse Files On Workstation
                <input
                  type="file"
                  hidden
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
              <div className="text-muted mt-3" style={{ fontSize: '0.78rem' }}>
                Maximum file size: 25MB • Strict FAAC schema validation enforced
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="data-card p-4 h-100">
              <h5 className="fw-bold text-primary mb-3 fs-6">Spreadsheet Format Requirements</h5>
              <ul className="small text-muted ps-3 mb-4" style={{ lineHeight: 1.8 }}>
                <li>Headers must match standard template columns exactly.</li>
                <li>LGA names must match the official 16 Kwara State entities.</li>
                <li>Currency amounts should be numeric without currency symbols.</li>
                <li>Gross and Deduction components will be cross-validated.</li>
              </ul>
              <div className="p-3 bg-light rounded border text-muted small">
                <strong>Need the layout?</strong> Click &ldquo;Download Excel/CSV Template&rdquo; above for the certified format.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress Indicator */}
      {isProcessing && (
        <div className="data-card p-4 mb-4 text-center">
          <h5 className="fw-semibold mb-2">Analyzing and Validating Spreadsheet Data...</h5>
          <div className="progress mb-2" style={{ height: 8 }}>
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <span className="text-muted small">{uploadProgress}% complete</span>
        </div>
      )}

      {/* Validation Preview & Confirmation Stage */}
      {previewRecords.length > 0 && !importSuccess && (
        <div className="data-card mb-4">
          <div className="card-header-custom flex-wrap gap-2">
            <div>
              <h3>Import Data Preview & Validation Inspection</h3>
              <span className="text-muted small">
                File: <strong>{selectedFile?.name || 'kwara_batch_october.xlsx'}</strong>
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success">{validCount} Valid</span>
              <span className="badge bg-warning text-dark">{warningCount} Warning</span>
              <span className="badge bg-danger">{errorCount} Errors</span>
              <button
                onClick={() => {
                  setPreviewRecords([]);
                  setSelectedFile(null);
                }}
                className="btn btn-sm btn-outline-secondary ms-2"
              >
                Upload Different File
              </button>
            </div>
          </div>

          {errorCount > 0 && (
            <div className="p-3 bg-danger-subtle text-danger-emphasis border-bottom small d-flex align-items-center gap-2">
              <FiXCircle size={18} />
              <span>
                <strong>Attention:</strong> 1 record has calculation errors and will be omitted from importation until corrected.
              </span>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Validation</th>
                  <th>LGA Name</th>
                  <th>Period</th>
                  <th className="text-end">Gross Allocation</th>
                  <th className="text-end">Deductions</th>
                  <th className="text-end">Net Allocation</th>
                  <th>Validation Advisory</th>
                </tr>
              </thead>
              <tbody>
                {previewRecords.map((r) => (
                  <tr key={r.id} className={r.status === 'Error' ? 'table-danger' : ''}>
                    <td>
                      {r.status === 'Valid' && (
                        <span className="badge bg-success d-inline-flex align-items-center gap-1">
                          <FiCheckCircle size={11} /> Valid
                        </span>
                      )}
                      {r.status === 'Warning' && (
                        <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1">
                          <FiAlertTriangle size={11} /> Warning
                        </span>
                      )}
                      {r.status === 'Error' && (
                        <span className="badge bg-danger d-inline-flex align-items-center gap-1">
                          <FiXCircle size={11} /> Error
                        </span>
                      )}
                    </td>
                    <td className="fw-semibold">{r.lgaName}</td>
                    <td>{r.month} {r.year}</td>
                    <td className="text-end font-monospace">{formatNaira(r.grossAllocation)}</td>
                    <td className="text-end font-monospace text-danger">({formatNaira(r.deductions)})</td>
                    <td className="text-end font-monospace fw-bold">
                      {formatNaira(r.netAllocation)}
                    </td>
                    <td className="small text-muted">{r.validationMessage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-light border-top d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="text-muted small">
              Ready to import <strong>{validCount + warningCount}</strong> validated records into the system.
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => handleConfirmImport('Draft')}
                disabled={isProcessing}
              >
                Import as Draft Records
              </button>
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center gap-1"
                onClick={() => handleConfirmImport('Published')}
                disabled={isProcessing}
              >
                <FiCheckCircle size={16} /> Confirm & Publish to Public
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
