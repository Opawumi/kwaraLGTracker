'use client';

import { useState } from 'react';
import { adminUsers as initialUsers, AdminUser } from '@/data/demoData';
import {
  FiUsers,
  FiUserPlus,
  FiCheckCircle,
  FiShield,
  FiMail,
  FiLock,
  FiClock,
  FiEdit2,
} from 'react-icons/fi';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Finance Officer');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const next = u.status === 'Active' ? 'Inactive' : 'Active';
          return { ...u, status: next };
        }
        return u;
      })
    );
    setAlertMsg('User access status updated.');
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      lastLogin: 'Never',
      status: 'Active',
    };

    setUsers([newUser, ...users]);
    setShowAddModal(false);
    setName('');
    setEmail('');
    setAlertMsg(`New administrator ${name} (${role}) invited successfully.`);
    setTimeout(() => setAlertMsg(null), 3000);
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>Authorized Administrative Users</h2>
          <p className="text-muted small mb-0">Role-based access control, security permissions, and session tracking.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
        >
          <FiUserPlus size={15} /> Add Administrator
        </button>
      </div>

      {alertMsg && (
        <div className="alert alert-success py-2 px-3 small mb-3">
          <FiCheckCircle className="me-2" /> {alertMsg}
        </div>
      )}

      {/* Users Table */}
      <div className="data-table-wrapper">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Administrator Name</th>
                <th>Institutional Email</th>
                <th>Security Role</th>
                <th>Last Login Session</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: '#0a1e3d',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="fw-semibold">{u.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-muted small">
                      <FiMail className="me-1" /> {u.email}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-light text-primary border">
                      <FiShield className="me-1" size={11} /> {u.role}
                    </span>
                  </td>
                  <td className="small text-muted font-monospace">
                    <FiClock className="me-1" /> {u.lastLogin}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        u.status === 'Active'
                          ? 'bg-success-subtle text-success border border-success-subtle'
                          : 'bg-secondary-subtle text-secondary border'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className={`btn btn-sm ${
                        u.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'
                      } py-0 px-2`}
                    >
                      {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleCreateUser}>
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold text-primary">Provision Administrative Account</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Official Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Ibrahim Lawal"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Government Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@kwara.gov.ng"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Assigned Administrative Role</label>
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="Super Admin">Super Admin (Unrestricted)</option>
                      <option value="Finance Officer">Finance Officer (Edit & Ingest)</option>
                      <option value="Auditor">Auditor (Read & Audit Trail)</option>
                      <option value="Data Entry">Data Entry (Drafts Only)</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Provision Account
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
