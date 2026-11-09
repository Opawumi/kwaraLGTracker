import Logo from '@/components/Logo';
import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          {/* Brand & description */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Logo size={36} />
              <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                kwaraLGTracker
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 16 }}>
              A transparency initiative providing public access to Federal Government
              allocation data for all Local Government Areas in Kwara State.
            </p>
            <div className="d-flex flex-column gap-1">
              <span style={{ fontSize: '0.82rem' }}>
                <FiMapPin style={{ marginRight: 8 }} /> Ilorin, Kwara State, Nigeria
              </span>
              <span style={{ fontSize: '0.82rem' }}>
                <FiMail style={{ marginRight: 8 }} /> mafyedi@gmail.com
              </span>
              <span style={{ fontSize: '0.82rem' }}>
                <FiPhone style={{ marginRight: 8 }} /> +2347030627945
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5>Quick Links</h5>
            <Link href="/">Home</Link>
            <Link href="/allocations">Allocations</Link>
            <Link href="/local-governments">Local Governments</Link>
            <Link href="/reports">Reports</Link>
            <Link href="/about">About</Link>
          </div>

          {/* Resources */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5>Resources</h5>
            <Link href="/reports">Annual Reports</Link>
            <Link href="/reports">Monthly Summaries</Link>
            <Link href="/allocations">Search Records</Link>
            <Link href="/about">Data Sources</Link>
          </div>

          {/* Legal */}
          <div className="col-lg-4 col-md-6">
            <h5>Disclaimer</h5>
            <div className="footer-disclaimer">
              All allocation figures displayed on this platform are sourced from publicly
              available FAAC (Federation Account Allocation Committee) distribution records.
              This platform is intended for informational and transparency purposes only.
              Figures presented are subject to official verification.
            </div>
          </div>
        </div>

        <div className="footer-bottom text-center">
          <p className="mb-0">
            © 2026 kwaraLGTracker.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
