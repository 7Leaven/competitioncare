'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchProgressDashboard } from '@/lib/api';

export default function ProgressPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchProgressDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNav />
        <div className="container-page py-12 flex-1 text-center text-slate-500">Loading progress...</div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNav />
        <div className="container-page py-12 flex-1 text-center text-slate-500">Failed to load progress.</div>
        <Footer />
      </div>
    );
  }

  const { summary, courseProgress, milestones } = data;

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1">
        <div className="mb-8">
          <Link href="/dashboard" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
            ← Back to dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Progress</h1>
          <p className="text-slate-600">Track your learning journey and celebrate milestones.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white">
            <div className="text-xs uppercase tracking-wider mb-2 opacity-80">Current Streak</div>
            <div className="text-4xl font-bold">{summary.currentStreak}</div>
            <div className="text-xs opacity-80 mt-1">day{summary.currentStreak !== 1 ? 's' : ''}</div>
          </div>
          <div className="card p-6 bg-gradient-to-br from-amber-400 to-amber-600 text-white">
            <div className="text-xs uppercase tracking-wider mb-2 opacity-80">Longest Streak</div>
            <div className="text-4xl font-bold">{summary.longestStreak}</div>
            <div className="text-xs opacity-80 mt-1">all-time</div>
          </div>
          <div className="card p-6">
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Lessons Done</div>
            <div className="text-4xl font-bold text-emerald-600">{summary.completedLessons}</div>
          </div>
          <div className="card p-6">
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Tests Taken</div>
            <div className="text-4xl font-bold text-purple-600">{summary.completedTests}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{summary.enrolledCourses}</div>
            <div className="text-xs text-slate-500 mt-1">Courses</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{summary.certificates}</div>
            <div className="text-xs text-slate-500 mt-1">Certificates</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-rose-600">{summary.bookmarks}</div>
            <div className="text-xs text-slate-500 mt-1">Bookmarks</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{summary.avgScore}</div>
            <div className="text-xs text-slate-500 mt-1">Avg Score</div>
          </div>
        </div>

        {courseProgress.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Course Progress</h2>
            <div className="space-y-5">
              {courseProgress.map((c: any) => (
                <div key={c.courseId}>
                  <div className="flex justify-between items-center mb-2">
                    <Link
                      href={`/courses/${c.courseId}`}
                      className="text-sm font-medium text-slate-800 hover:text-indigo-600 truncate pr-4"
                    >
                      {c.courseTitle}
                    </Link>
                    <div className="text-xs text-slate-500 whitespace-nowrap">
                      {c.completedLessons} / {c.totalLessons} lessons • {c.percent}%
                    </div>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        c.percent === 100
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                      style={{ width: `${c.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {milestones.map((m: any) => (
              <div
                key={m.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                  m.achieved
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    m.achieved
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {m.achieved ? '✓' : '○'}
                </div>
                <div
                  className={`text-sm ${
                    m.achieved ? 'text-emerald-800 font-medium' : 'text-slate-500'
                  }`}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}