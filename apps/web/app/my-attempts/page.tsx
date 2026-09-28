'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchMyAttempts } from '@/lib/api';

type Attempt = {
  id: string;
  testId: string;
  startedAt: string;
  submittedAt: string | null;
  score: number | null;
  test?: { id: string; title: string; duration?: number };
};

export default function MyAttemptsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchMyAttempts()
      .then(setAttempts)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return attempts.filter((a) => {
      if (filter === 'completed' && !a.submittedAt) return false;
      if (filter === 'in-progress' && a.submittedAt) return false;
      if (search && !a.test?.title?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [attempts, filter, search]);

  const stats = useMemo(() => {
    const completed = attempts.filter((a) => a.submittedAt);
    const totalScore = completed.reduce((sum, a) => sum + (a.score || 0), 0);
    const avgScore = completed.length > 0 ? Math.round(totalScore / completed.length) : 0;
    const bestScore = completed.length > 0 ? Math.max(...completed.map((a) => a.score || 0)) : 0;
    return {
      total: attempts.length,
      completed: completed.length,
      avgScore,
      bestScore,
    };
  }, [attempts]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNav />
        <div className="container-page py-12 flex-1 text-center text-slate-500">Loading attempts...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1">
        <div className="mb-8">
          <Link href="/dashboard" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
            ← Back to dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Attempts</h1>
          <p className="text-slate-600">All your test attempts in one place.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-5">
            <div className="text-sm text-slate-500 mb-1">Total Attempts</div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          </div>
          <div className="card p-5">
            <div className="text-sm text-slate-500 mb-1">Completed</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
          </div>
          <div className="card p-5">
            <div className="text-sm text-slate-500 mb-1">Avg Score</div>
            <div className="text-2xl font-bold text-indigo-600">{stats.avgScore}</div>
          </div>
          <div className="card p-5">
            <div className="text-sm text-slate-500 mb-1">Best Score</div>
            <div className="text-2xl font-bold text-amber-600">{stats.bestScore}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-2">
            {(['all', 'completed', 'in-progress'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-slate-600 hover:border-indigo-500'
                }`}
              >
                {f === 'all' ? 'All' : f === 'completed' ? 'Completed' : 'In Progress'}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search by test name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1 sm:max-w-xs"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              {attempts.length === 0 ? 'No attempts yet' : 'No matching attempts'}
            </h2>
            <p className="text-slate-600 mb-6">
              {attempts.length === 0
                ? 'Take your first test to see results here.'
                : 'Try changing the filter or search term.'}
            </p>
            {attempts.length === 0 && (
              <Link href="/tests" className="btn-primary inline-block">Browse Tests</Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => (
              <div key={a.id} className="card p-5 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {a.submittedAt ? (
                        <span className="badge badge-success">Completed</span>
                      ) : (
                        <span className="badge badge-warning">In Progress</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {a.test?.title || 'Test'}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1">
                      Started {new Date(a.startedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {a.submittedAt && a.score !== null && (
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Score</div>
                        <div className="text-2xl font-bold text-indigo-600">{a.score}</div>
                      </div>
                    )}
                    {a.submittedAt ? (
                      <Link
                        href={`/tests/${a.testId}/result/${a.id}`}
                        className="btn-secondary text-sm whitespace-nowrap"
                      >
                        View Result
                      </Link>
                    ) : (
                      <Link
                        href={`/tests/${a.testId}/take`}
                        className="btn-primary text-sm whitespace-nowrap"
                      >
                        Resume
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}