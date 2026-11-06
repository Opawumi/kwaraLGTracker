'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { lgas, publishedRecords } from '@/data/demoData';
import { formatNairaShort } from '@/lib/utils';
import { FiSearch, FiMapPin, FiUsers, FiMaximize2, FiArrowRight } from 'react-icons/fi';

export default function LocalGovernmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLGAs = useMemo(() => {
    if (!searchTerm.trim()) return lgas;
    const term = searchTerm.toLowerCase();
    return lgas.filter(
      (l) =>
        l.name.toLowerCase().includes(term) ||
        l.headquarters.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Helper for latest net allocation
  const getLgaStats = (lgaId: string) => {
    const records = publishedRecords
      .filter((r) => r.lgaId === lgaId)
      .sort((a, b) => b.year - a.year || b.month - a.month);

    const latest = records[0]?.netAllocation || 0;
    const total = records.reduce((s, r) => s + r.netAllocation, 0);

    return { latest, total, count: records.length };
  };

  return (
    <PublicLayout>
      <section className="page-header">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Local Governments</li>
            </ol>
          </nav>
          <h1>Local Government Areas in Kwara State</h1>
          <p>
            Explore economic profiles, administrative headquarters, and allocation summaries for all 16 Local Government Areas.
          </p>
        </div>
      </section>

      <div className="container py-4">
        {/* Search Toolbar */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 p-3 bg-white border rounded">
          <div className="text-secondary small">
            Displaying <strong>{filteredLGAs.length}</strong> of {lgas.length} Local Government Areas
          </div>
          <div style={{ maxWidth: 320, width: '100%' }}>
            <div className="position-relative">
              <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8d95a0' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search by LGA name or headquarters..."
                style={{ paddingLeft: 36 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* LGA Directory Grid */}
        <div className="row g-4">
          {filteredLGAs.map((lga) => {
            const stats = getLgaStats(lga.id);
            return (
              <div className="col-lg-4 col-md-6" key={lga.id}>
                <div className="data-card h-100 d-flex flex-column">
                  <div className="p-4 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h4 className="fw-bold mb-1 text-primary">{lga.name}</h4>
                        <span className="badge bg-light text-dark border">
                          <FiMapPin className="me-1 text-muted" /> HQ: {lga.headquarters}
                        </span>
                      </div>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          background: 'rgba(10, 30, 61, 0.08)',
                          color: '#0a1e3d',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                        }}
                      >
                        {lga.name.slice(0, 2).toUpperCase()}
                      </div>
                    </div>

                    <div className="row g-2 mb-3 py-2 border-top border-bottom small text-muted">
                      <div className="col-6">
                        <FiUsers className="me-1" /> Population:
                        <div className="fw-semibold text-dark">{lga.population}</div>
                      </div>
                      <div className="col-6">
                        <FiMaximize2 className="me-1" /> Land Area:
                        <div className="fw-semibold text-dark">{lga.area}</div>
                      </div>
                    </div>

                    <div className="bg-light p-3 rounded mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-muted small">Latest Net Allocation:</span>
                        <strong className="text-success">{formatNairaShort(stats.latest)}</strong>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small">Total Cumulative Receipts:</span>
                        <strong className="text-primary">{formatNairaShort(stats.total)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-light border-top text-end">
                    <Link
                      href={`/allocations/${lga.slug}`}
                      className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                    >
                      View Allocation Profile <FiArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredLGAs.length === 0 && (
            <div className="col-12">
              <div className="empty-state py-5">
                <div className="empty-icon">📍</div>
                <h4>No Local Governments Found</h4>
                <p className="text-muted">No LGAs matched your search query &ldquo;{searchTerm}&rdquo;.</p>
                <button onClick={() => setSearchTerm('')} className="btn btn-sm btn-primary mt-2">
                  Show All LGAs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
