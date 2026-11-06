import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { FiCheckCircle, FiShield, FiFileText, FiLayers, FiHelpCircle, FiArrowRight } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Header */}
      <section className="page-header">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">About the Platform</li>
            </ol>
          </nav>
          <h1>About kwaraLGTracker</h1>
          <p>
            Promoting open government, fiscal accountability, and citizen empowerment across Kwara State.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9 content-page">

            {/* Purpose */}
            <div className="p-4 bg-white border rounded mb-4 shadow-sm">
              <h2 className="d-flex align-items-center gap-2 mt-0">
                <FiShield className="text-primary" /> Purpose of the Platform
              </h2>
              <p>
                <strong>kwaraLGTracker</strong> is an institutional initiative designed to make financial distributions from the Federation Account Allocation Committee (FAAC) to all 16 Local Government Areas in Kwara State completely accessible, verifiable, and transparent to the general public.
              </p>
              <p>
                By opening allocation records to citizens, civil society organizations, researchers, and community leaders, the platform bridges the gap between public finances and grassroots governance. We believe open fiscal data empowers communities to participate constructively in local development priorities.
              </p>
            </div>

            {/* Key Objectives */}
            <div className="p-4 bg-white border rounded mb-4 shadow-sm">
              <h2 className="d-flex align-items-center gap-2 mt-0">
                <FiCheckCircle className="text-success" /> Core Objectives
              </h2>
              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded border h-100">
                    <h5 className="fw-bold fs-6 text-primary">Unrestricted Public Access</h5>
                    <p className="small mb-0 text-muted">
                      Every citizen can inspect verified disbursement figures without requiring registration, login credentials, or paying fees.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded border h-100">
                    <h5 className="fw-bold fs-6 text-primary">Fiscal Integrity & Verification</h5>
                    <p className="small mb-0 text-muted">
                      Allocations are reconciled with official federal remittance schedules, backed by published supporting documentation.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded border h-100">
                    <h5 className="fw-bold fs-6 text-primary">Granular Revenue Breakdown</h5>
                    <p className="small mb-0 text-muted">
                      Disbursements detail statutory allocations, VAT shares, excess crude distributions, and statutory deductions.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded border h-100">
                    <h5 className="fw-bold fs-6 text-primary">Machine-Readable Data</h5>
                    <p className="small mb-0 text-muted">
                      Financial records and comparative tables can be exported in open CSV/Excel and PDF formats for independent analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sources */}
            <div className="p-4 bg-white border rounded mb-4 shadow-sm">
              <h2 className="d-flex align-items-center gap-2 mt-0">
                <FiFileText className="text-primary" /> Official Data Sources
              </h2>
              <p>
                All data presented on this platform originates from official government distribution organs:
              </p>
              <ul>
                <li>
                  <strong>Federation Account Allocation Committee (FAAC):</strong> The federal body chaired by the Minister of State for Finance that oversees the statutory monthly distribution of revenue among the Federal, State, and Local Governments.
                </li>
                <li>
                  <strong>State Joint Local Government Account Committee (JAAC):</strong> The constitutional body responsible for disbursing FAAC revenues to individual Local Government Councils within Kwara State.
                </li>
                <li>
                  <strong>Office of the Accountant-General of the Federation (OAGF):</strong> Publishes monthly revenue collection and disbursement schedules across all tiers of government.
                </li>
              </ul>
            </div>

            {/* Understanding the Figures Guide */}
            <div className="p-4 bg-white border rounded mb-4 shadow-sm">
              <h2 className="d-flex align-items-center gap-2 mt-0">
                <FiHelpCircle className="text-primary" /> Understanding the Allocation Breakdown
              </h2>
              <p>
                To help visitors correctly interpret published figures, here is an explanation of the standard revenue and deduction components:
              </p>

              <div className="table-responsive my-3">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '25%' }}>Term</th>
                      <th>Definition & Explanation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold text-primary">Gross Allocation</td>
                      <td>
                        The total amount of revenue allocated to an LGA before any contractual or statutory deductions are subtracted.
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Statutory Allocation</td>
                      <td>
                        The primary mineral and non-mineral revenue allocated from the Federation Account based on constitutional horizontal sharing formulas (equality, population, land mass, etc.).
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Value Added Tax (VAT)</td>
                      <td>
                        The LGA’s percentage share of nationwide Value Added Tax collections distributed on the basis of equality, population, and derivation.
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-danger">Total Deductions</td>
                      <td>
                        Authorized deductions including external debt obligations, contractual obligations, loan repayments, and standard statutory charges.
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-success">Net Allocation</td>
                      <td>
                        The actual final amount disbursed into the Local Government Area&apos;s account (Gross Allocation minus Total Deductions).
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disclaimer & Transparency Note */}
            <div className="alert alert-warning p-4 border rounded mb-4">
              <h5 className="alert-heading fw-bold">⚠️ Demonstration & Transparency Notice</h5>
              <p className="mb-0 small">
                The data currently displayed on this demonstration environment contains simulated figures (marked as DEMO DATA) designed to illustrate the operational workflow and architecture of the Kwara State Local Government Allocation Transparency Platform. In production, this platform connects to verified FAAC and JAAC disbursement repositories.
              </p>
            </div>

            {/* CTA */}
            <div className="text-center mt-5">
              <Link href="/allocations" className="btn btn-accent btn-lg px-4 me-2">
                Explore Allocations <FiArrowRight className="ms-1" />
              </Link>
              <Link href="/reports" className="btn btn-outline-primary btn-lg px-4">
                View Reports & Trends
              </Link>
            </div>

          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
