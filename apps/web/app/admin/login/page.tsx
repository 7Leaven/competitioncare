'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, fetchMe } from '@/lib/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.access_token);

      const user = await fetchMe();
      if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
        localStorage.removeItem('token');
        setError('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 p-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-gray-500 text-sm">CompetitionCare Administration</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Admin Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 disabled:opacity-50 font-medium"
        >
          {loading ? 'Verifying...' : 'Sign In to Admin'}
        </button>

        <div className="text-center mt-6 text-sm text-gray-500">
          <Link href="/" className="hover:underline">
            Back to site
          </Link>
        </div>
      </form>
    </main>
  );
}
