'use client';

import { useState } from 'react';
import Link from 'next/link';
import { login } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.access_token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-900 text-white p-12 flex-col justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-700 font-bold">C</div>
          <span className="text-xl font-bold">CompetitionCare</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold mb-4">Welcome back.</h2>
          <p className="text-indigo-100 text-lg">Continue your journey towards exam success.</p>
        </div>
        <p className="text-indigo-200 text-sm">Copyright {new Date().getFullYear()} CompetitionCare</p>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <Link href="/" className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">C</div>
            <span className="text-lg font-bold">CompetitionCare</span>
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign in</h1>
          <p className="text-slate-600 mb-8">Enter your credentials to continue</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-6 text-sm">{error}</div>
          )}

          <label className="block mb-4">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" placeholder="you@example.com" />
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" />
          </label>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mb-4">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
