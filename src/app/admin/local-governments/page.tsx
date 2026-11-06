'use client';

import { useState } from 'react';
import Link from 'next/link';
import { lgas, publishedRecords, draftRecords } from '@/data/demoData';
import { formatNairaShort } from '@/lib/utils';
import { FiMapPin, FiSearch, FiEdit, FiExternalLink, FiPlus } from 'react-icons/fi';

export default function AdminLocalGovernmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = lgas.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.headquarters.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>Local Government Areas Registry</h2>
          <p className="text-muted small mb-0">Master catalog of all 16 Local Government administrative entities in Kwara State.</p>
        </div>
      </div>

      <div className="filters-bar mb-4">
        <div className="row g-3">
          <div className="col-md-5">
            <label>Search LGA Registry</label>
            <div className="position-relative">
              <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8d95a0' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: 36 }}
                placeholder="Search LGA name or headquarters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="data-table-wrapper">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>LGA Name</th>
                <th>Headquarters</th>
                <th>Population</th>
                <th>Land Area</th>
                <th>Published Vouchers</th>
                <th>Draft Vouchers</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lga) => {
                const pubCount = publishedRecords.filter((r) => r.lgaId === lga.id).length;
                const draftCount = draftRecords.filter((r) => r.lgaId === lga.id).length;
                return (
                  <tr key={lga.id}>
                    <td className="fw-semibold text-primary">{lga.name}</td>
                    <td>
                      <FiMapPin className="text-muted me-1" size={13} />
                      {lga.headquarters}
                    </td>
                    <td>{lga.population}</td>
                    <td>{lga.area}</td>
                    <td>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">
                        {pubCount} Published
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
                        {draftCount} Draft
                      </span>
                    </td>
                    <td className="text-center">
                      <Link
                        href={`/admin/allocations?search=${lga.name}`}
                        className="btn btn-sm btn-outline-primary py-0 px-2 me-1"
                      >
                        View Records
                      </Link>
                      <Link
                        href={`/allocations/${lga.slug}`}
                        target="_blank"
                        className="btn btn-sm btn-outline-secondary py-0 px-2"
                        title="View public profile"
                      >
                        <FiExternalLink size={12} />
                      </Link>
                    </td>
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
