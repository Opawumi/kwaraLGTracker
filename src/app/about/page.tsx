import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { FiCheckCircle, FiShield, FiFileText, FiHelpCircle, FiArrowRight, FiHeart } from 'react-icons/fi';

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
          <h1>About the Platform</h1>
          <p>
            Promoting open government, fiscal accountability, and citizen empowerment across Kwara State.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9 content-page">

            {/* Purpose & Background */}
            <div className="p-4 bg-white border rounded mb-4 shadow-sm">
              <h2 className="d-flex align-items-center gap-2 mt-0">
                <FiShield className="text-primary" /> About the Platform
              </h2>
              <p>
                As the third tier of government, local governments were established to bring governance and development closer to grassroots communities through the provision of basic, essential services and the implementation of targeted development programmes.
              </p>
              <p>
                However, many local government councils across Nigeria have consistently fallen short of these responsibilities, despite receiving increased federal allocations, thereby undermining community growth and development at the grassroots level. This gap is largely driven by interference from state governors as well as widespread citizen apathy toward local governance.
              </p>
              <p>
                A significant proportion of citizens remain far more fixated on national and state-level political developments than on the activities of the councils closest to them, creating a vacuum of accountability that poorly performing councils have exploited with impunity. People also lack access to information regarding the finances of their local government councils, which could equip them to demand accountability.
              </p>
              <p>
                <strong>kwaraLGTracker</strong> is therefore designed for Kwarans to access information about their council&apos;s finances, especially monthly federal allocations, report abandoned or poorly executed projects, and provide feedback on council services. Our goal is to promote a culture of accountability and transparency that strengthens good governance and improves service delivery across the 16 local government councils of Kwara State.
              </p>
            </div>

            {/* Acknowledgment / Partner */}
            <div className="p-4 bg-white border rounded mb-4 shadow-sm border-start border-4 border-success">
              <h3 className="h5 d-flex align-items-center gap-2 mt-0 text-success fw-bold">
                <FiHeart className="text-danger" /> Acknowledgement & Support
              </h3>
              <p className="mb-0 text-secondary">
                We are grateful to <strong>Naijayouthfund</strong> for supporting this project and its shared commitment to building a more accountable and citizen-centered democracy in Nigeria.
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
