'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { fetchMe } from '@/lib/api';

type User = { id: string; email: string; role: string };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchMe()
      .then((data) => {
        if (!data || (data.role !== 'ADMIN' && data.role !== 'SUPERADMIN')) {
          localStorage.removeItem('token');
          router.push('/admin/login');
          return;
        }
        setUser(data);
      })
      .finally(() => setLoading(false));
  }, [pathname, isLoginPage, router]);

  function logout() {
    localStorage.removeItem('token');
    router.push('/admin/login');
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) return <main className="p-8">Checking access...</main>;
  if (!user) return null;

  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/courses', label: 'Courses' },
    { href: '/admin/tests', label: 'Tests' },
    { href: '/admin/current-affairs', label: 'Current Affairs' },
    { href: '/admin/blogs', label: 'Blogs' },
    { href: '/admin/resources', label: 'Resources' },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-gray-50 p-6">
        <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded ${
                pathname === link.href
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 pt-6 border-t text-sm text-gray-500">
          <p>{user.email}</p>
          <p className="mt-1">{user.role}</p>
          <button
            onClick={logout}
            className="mt-3 text-blue-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
