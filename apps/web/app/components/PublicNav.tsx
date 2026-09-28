'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchUnreadCount } from '@/lib/api';

export default function PublicNav() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
    if (token) {
      fetchUnreadCount()
        .then((data) => setUnread(data.unreadCount))
        .catch(() => {});
      const interval = setInterval(() => {
        fetchUnreadCount()
          .then((data) => setUnread(data.unreadCount))
          .catch(() => {});
      }, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  function logout() {
    localStorage.removeItem('token');
    setLoggedIn(false);
    router.push('/');
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  }

  const navLinks = [
    { href: '/courses', label: 'Courses' },
    { href: '/tests', label: 'Tests' },
    { href: '/current-affairs', label: 'Current Affairs' },
    { href: '/blogs', label: 'Blog' },
    { href: '/resources', label: 'Resources' },
  ];

  const accountLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/progress', label: 'Progress' },
    { href: '/my-analytics', label: 'Analytics' },
    { href: '/bookmarks', label: 'Bookmarks' },
    { href: '/certificates', label: 'Certificates' },
    { href: '/doubts', label: 'Doubts' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-page">
        <div className="flex justify-between items-center h-16 gap-3">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">C</div>
            <span className="text-lg font-bold text-slate-900 hidden sm:inline">CompetitionCare</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden xl:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, tests, articles..."
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </div>
          </form>

          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {loggedIn ? (
              <>
                <Link href="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium text-sm whitespace-nowrap">
                  Dashboard
                </Link>
                <Link
                  href="/notifications"
                  className="relative text-slate-600 hover:text-indigo-600"
                  aria-label="Notifications"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>
                <button onClick={logout} className="text-slate-500 hover:text-slate-900 text-sm whitespace-nowrap">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-slate-600 hover:text-indigo-600 font-medium text-sm whitespace-nowrap">
                  Login
                </Link>
                <Link href="/login" className="btn-primary text-sm whitespace-nowrap">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-slate-600 p-2"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 pt-4 max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </div>
            </form>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 px-2 rounded text-slate-700 font-medium hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-gray-100 space-y-1">
              {loggedIn ? (
                <>
                  {accountLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-2 px-2 rounded text-slate-700 font-medium hover:bg-gray-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/notifications"
                    className="block py-2 px-2 rounded text-slate-700 font-medium hover:bg-gray-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    Notifications {unread > 0 && <span className="ml-1 text-red-500">({unread})</span>}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="block w-full text-left py-2 px-2 rounded text-slate-500 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block py-2 px-2 rounded text-slate-700 font-medium hover:bg-gray-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/login"
                    className="block py-2 px-2 rounded text-indigo-600 font-medium hover:bg-gray-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}