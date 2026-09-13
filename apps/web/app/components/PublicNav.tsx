'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PublicNav() {
  const [loggedIn, setLoggedIn] = useState(false);
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

  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto p-4 flex justify-between items-center flex-wrap gap-4">
        <Link href="/" className="text-2xl font-bold">
          CompetitionCare
        </Link>
        <nav className="flex gap-4 flex-wrap items-center text-sm">
          <Link href="/courses" className="hover:underline">
            Courses
          </Link>
          <Link href="/tests" className="hover:underline">
            Tests
          </Link>
          <Link href="/current-affairs" className="hover:underline">
            Current Affairs
          </Link>
          <Link href="/blogs" className="hover:underline">
            Blog
          </Link>
          <Link href="/resources" className="hover:underline">
            Resources
          </Link>
          {loggedIn ? (
            <>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="hover:underline text-gray-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
