'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PublicNav() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  function logout() {
    localStorage.removeItem('token');
    setLoggedIn(false);
    router.push('/');
  }

  const navLinks = [
    { href: '/courses', label: 'Courses' },
    { href: '/tests', label: 'Test Series' },
    { href: '/current-affairs', label: 'Current Affairs' },
    { href: '/blogs', label: 'Blog' },
    { href: '/resources', label: 'Resources' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-page">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">C</div>
            <span className="text-xl font-bold text-slate-900">CompetitionCare</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {loggedIn ? (
              <>
                <Link href="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium text-sm">Dashboard</Link>
                <button onClick={logout} className="text-slate-500 hover:text-slate-900 text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-slate-600 hover:text-indigo-600 font-medium text-sm">Login</Link>
                <Link href="/login" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-slate-600" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-100 pt-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block py-2 text-slate-700 font-medium" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100">
              {loggedIn ? (
                <>
                  <Link href="/dashboard" className="block py-2 text-slate-700 font-medium">Dashboard</Link>
                  <button onClick={logout} className="block py-2 text-slate-500">Logout</button>
                </>
              ) : (
                <Link href="/login" className="block py-2 text-indigo-600 font-medium">Login / Sign Up</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
