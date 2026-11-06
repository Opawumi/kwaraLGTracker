'use client';
import Logo from '@/components/Logo';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { RiShieldKeyholeLine } from 'react-icons/ri';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/allocations', label: 'Allocations' },
    { href: '/local-governments', label: 'Local Governments' },
    { href: '/reports', label: 'Reports' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="navbar navbar-expand-lg public-navbar">
      <div className="container">
        <Link href="/" className="navbar-brand">
          <Logo size={36} />
          <span>kwaraLGTracker</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? (
            <FiX color="#fff" size={24} />
          ) : (
            <FiMenu color="#fff" size={24} />
          )}
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="nav-item">
              <Link
                href="/admin/login"
                className="nav-link navbar-admin-link"
                onClick={() => setIsOpen(false)}
              >
                <RiShieldKeyholeLine style={{ marginRight: 4 }} />
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
