'use client';

import { useEffect, useState } from 'react';
import {
  fetchAnalyticsSummary,
  fetchSignups,
  fetchTopCourses,
} from '@/lib/api';

type Summary = {
  totalUsers: number;
  totalRevenue: number;
  totalEnrollments: number;
  totalAttempts: number;
  last30DaysUsers: number;
};

type Signup = { date: string; count: number };
type TopCourse = { courseTitle: string; enrollments: number };

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [topCourses, setTopCourses] = useState<TopCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAnalyticsSummary(),
      fetchSignups(30),
      fetchTopCourses(5),
    ]).then(([s, sg, tc]) => {
      setSummary(s);
      setSignups(sg);
      setTopCourses(tc);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="p-8">Loading analytics...</p>;
  if (!summary) return <p className="p-8">No data available.</p>;

  const maxCount = Math.max(...signups.map(d => d.count), 1);
  const chartWidth = 600;
  const chartHeight = 200;
  const points = signups
    .map((d, i) => {
      const x = (i / (signups.length - 1)) * chartWidth;
      const y = chartHeight - (d.count / maxCount) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="card p-4">
          <div className="text-xs text-slate-500">Total Users</div>
          <div className="text-2xl font-bold">{summary.totalUsers}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500">Revenue</div>
          <div className="text-2xl font-bold">₹{summary.totalRevenue.toLocaleString()}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500">Enrollments</div>
          <div className="text-2xl font-bold">{summary.totalEnrollments}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500">Test Attempts</div>
          <div className="text-2xl font-bold">{summary.totalAttempts}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500">New (30d)</div>
          <div className="text-2xl font-bold">{summary.last30DaysUsers}</div>
        </div>
      </div>

      <div className="card p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Daily Signups (last 30 days)</h2>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48">
          <polyline
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2"
            points={points}
          />
        </svg>
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>{signups[0]?.date}</span>
          <span>{signups[signups.length - 1]?.date}</span>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Top 5 Courses by Enrollment</h2>
        {topCourses.length === 0 ? (
          <p className="text-slate-500">No enrollments yet.</p>
        ) : (
          <div className="space-y-2">
            {topCourses.map((c, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-6 text-slate-500 font-mono">{i + 1}.</div>
                <div className="flex-1 font-medium">{c.courseTitle}</div>
                <div className="text-indigo-600 font-semibold">{c.enrollments}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}