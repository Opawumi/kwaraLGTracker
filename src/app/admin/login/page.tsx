'use client';
import Logo from '@/components/Logo';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiEye, FiEyeOff, FiLock, FiMail, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@kwara.gov.ng');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both administrative email and password.');
      return;
    }

    setLoading(true);

    // Realistic authentication simulation
    setTimeout(() => {
      setLoading(false);
      // Accept demo credentials
      if (email.includes('@') && password.length >= 6) {
        // Set a demo session flag in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('kwara_admin_auth', 'true');
          sessionStorage.setItem('kwara_admin_user', email);
        }
        router.push('/admin/dashboard');
      } else {
        setError('Invalid administrative credentials. Use the demo pre-filled values.');
      }
    }, 600);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Logo and institutional title */}
        <div className="login-logo">
          <div style={{ marginBottom: 16 }}><Logo size={64} /></div>
          <h2>State Administration Portal</h2>
          <p>kwaraLGTracker</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3" role="alert">
            <FiAlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {forgotPasswordMsg && (
          <div className="alert alert-info py-2 px-3 small mb-3">
            Password reset link sent to your registered government email. (Simulated)
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label" htmlFor="admin-email">Institutional Email</label>
            <div className="position-relative">
              <input
                id="admin-email"
                type="email"
                className="form-control"
                placeholder="name@kwara.gov.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <label className="form-label mb-1" htmlFor="admin-password">Password</label>
              <button
                type="button"
                className="btn btn-link p-0 small text-decoration-none text-muted"
                style={{ fontSize: '0.8rem' }}
                onClick={() => setForgotPasswordMsg(true)}
              >
                Forgot password?
              </button>
            </div>
            <div className="password-wrapper">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter authorized password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label small text-secondary" htmlFor="rememberMe">
              Remember this workstation for 30 days
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <FiLock size={16} /> Authenticate & Access
              </>
            )}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-4 p-3 bg-light rounded border text-muted" style={{ fontSize: '0.78rem' }}>
          <strong>Authorized Access Only:</strong> This console is restricted to authorized state finance officers and data administrators.
          <div className="mt-1 text-primary">
            Demo pre-filled credentials: <code>admin@kwara.gov.ng</code>
          </div>
        </div>

        {/* Back to public site */}
        <div className="text-center mt-4">
          <Link href="/" className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1">
            <FiArrowLeft size={14} /> Return to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
