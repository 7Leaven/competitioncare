'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchMyAnalytics } from '@/lib/api';

export default function MyAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchMyAnalytics()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNav />
        <div className="container-page py-12 flex-1 text-center text-slate-500">Loading analytics...</div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNav />
        <div className="container-page py-12 flex-1 text-center text-slate-500">
          <div className="card p-12 max-w-lg mx-auto">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-xl font-bold mb-2">No analytics yet</h2>
            <p className="text-slate-600 mb-4">Take some tests to see your performance analysis.</p>
            <Link href="/tests" className="btn-primary inline-block">Browse Tests</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { summary, scoreTrend, byTest, recent } = data;
  const maxScore = Math.max(...scoreTrend.map((s: any) => s.score), 1);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1">
        <div className="mb-8">
          <Link href="/dashboard" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
            ← Back to dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Test Analytics</h1>
          <p className="text-slate-600">Your performance insights and progress over time.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="card p-4">
            <div className="text-xs text-slate-500 mb-1">Total Attempts</div>
            <div className="text-2xl font-bold text-slate-900">{summary.totalAttempts}</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-slate-500 mb-1">Completed</div>
            <div className="text-2xl font-bold text-emerald-600">{summary.completedAttempts}</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-slate-500 mb-1">In Progress</div>
            <div className="text-2xl font-bold text-amber-600">{summary.inProgress}</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-slate-500 mb-1">Avg Score</div>
            <div className="text-2xl font-bold text-indigo-600">{summary.avgScore}</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-slate-500 mb-1">Best Score</div>
            <div className="text-2xl font-bold text-purple-600">{summary.bestScore}</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-slate-500 mb-1">Accuracy</div>
            <div className="text-2xl font-bold text-blue-600">{summary.accuracy}%</div>
          </div>
        </div>

        {scoreTrend.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Score Trend</h2>
            <div className="flex items-end gap-2 h-48 border-b border-l border-gray-200 pl-4 pb-2">
              {scoreTrend.map((point: any, i: number) => {
                const height = maxScore > 0 ? (point.score / maxScore) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative min-w-0">
                    <div className="text-xs font-semibold text-indigo-600 mb-1 opacity-0 group-hover:opacity-100 transition">
                      {point.score}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t transition-all hover:from-indigo-700 hover:to-indigo-500 min-h-[4px]"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                    <div className="absolute -bottom-6 text-[10px] text-slate-500 truncate max-w-full">
                      {new Date(point.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 text-xs text-slate-500 text-center">
              {scoreTrend.length} completed attempt{scoreTrend.length !== 1 ? 's' : ''} over time
            </div>
          </div>
        )}

        {byTest.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Performance by Test</h2>
            <div className="space-y-4">
              {byTest.map((t: any) => {
                const percent = t.bestScore > 0 ? Math.min(100, t.bestScore * 10) : 0;
                return (
                  <div key={t.testId}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium text-slate-800 truncate pr-4">{t.testTitle}</div>
                      <div className="text-xs text-slate-500 whitespace-nowrap">
                        {t.attempts} attempt{t.attempts !== 1 ? 's' : ''} • avg {t.avgScore} • best {t.bestScore}
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {recent.length > 0 && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Recent Attempts</h2>
              <Link href="/my-attempts" className="text-indigo-600 hover:underline text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recent.map((a: any) => (
                <div key={a.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:border-indigo-200 transition">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate">{a.testTitle}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(a.startedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {a.score !== null ? (
                      <div className="text-2xl font-bold text-indigo-600">{a.score}</div>
                    ) : (
                      <span className="badge badge-warning">In Progress</span>
                    )}
                    {a.submittedAt && (
                      <Link
                        href={`/tests/${a.testId}/result/${a.id}`}
                        className="btn-secondary text-xs whitespace-nowrap"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}