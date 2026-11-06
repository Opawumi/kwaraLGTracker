'use client';
import Logo from '@/components/Logo';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiGrid,
  FiList,
  FiPlusCircle,
  FiUploadCloud,
  FiMapPin,
  FiBarChart2,
  FiFolder,
  FiUsers,
  FiActivity,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiExternalLink,
  FiBell,
  FiUser,
} from 'react-icons/fi';

interface AdminLayoutShellProps {
  children: React.ReactNode;
}

export default function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, render children directly without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore network errors on logout
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('kwara_admin_auth');
      sessionStorage.removeItem('kwara_admin_user');
    }
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { section: 'Overview', items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
    ]},
    { section: 'Allocations Management', items: [
      { href: '/admin/allocations', label: 'Manage Allocations', icon: FiList },
      { href: '/admin/allocations/new', label: 'Add Allocation', icon: FiPlusCircle },
      { href: '/admin/bulk-upload', label: 'Bulk Upload (Excel/CSV)', icon: FiUploadCloud },
    ]},
    { section: 'State Entities & Records', items: [
      { href: '/admin/local-governments', label: 'Local Governments', icon: FiMapPin },
      { href: '/admin/reports', label: 'Financial Reports', icon: FiBarChart2 },
      { href: '/admin/documents', label: 'Supporting Documents', icon: FiFolder },
    ]},
    { section: 'Governance & Security', items: [
      { href: '/admin/users', label: 'Admin Users', icon: FiUsers },
      { href: '/admin/audit-logs', label: 'Audit Logs', icon: FiActivity },
      { href: '/admin/settings', label: 'System Settings', icon: FiSettings },
    ]},
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Logo size={36} />
          <div>
            <span>kwaraLGTracker</span>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Admin Console
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((group, gIdx) => (
            <div key={gIdx} className="mb-2">
              <div className="sidebar-section-title">{group.section}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="link-icon" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Quick link to public website */}
          <div className="sidebar-section-title">Portals</div>
          <Link
            href="/"
            target="_blank"
            className="sidebar-link"
          >
            <FiExternalLink className="link-icon" />
            <span>View Public Website</span>
          </Link>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="sidebar-link w-100 text-start border-0 bg-transparent text-danger mt-2"
          >
            <FiLogOut className="link-icon" />
            <span>Sign Out</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="small text-white-50">Logged in as</div>
          <div className="fw-semibold small text-white text-truncate">admin@kwara.gov.ng</div>
        </div>
      </aside>

      {/* Main Administrative Container */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Navigation"
            >
              <FiMenu />
            </button>
            <div className="topbar-title">
              <h1>State Allocation Authority</h1>
              <p>Federation Account Local Government Disbursement Management</p>
            </div>
          </div>

          <div className="topbar-actions">
            <Link
              href="/"
              target="_blank"
              className="btn btn-sm btn-outline-secondary d-none d-md-inline-flex align-items-center gap-1"
            >
              <FiExternalLink size={13} /> Public Site
            </Link>

            <div className="topbar-user">
              <div className="user-avatar">AI</div>
              <div className="d-none d-sm-block">
                <div className="user-name">Abdulrahman I.</div>
                <div className="user-role">Super Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Demo banner inside admin */}
        <div style={{ background: '#fff3cd', color: '#856404', padding: '6px 20px', fontSize: '0.8rem', borderBottom: '1px solid #ffeeba' }}>
          <strong>Admin Test Environment:</strong> All records modified here are retained in the session demo database.
        </div>

        {/* Content body */}
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
