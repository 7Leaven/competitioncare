'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchMyEnrollments, fetchMyAttempts } from '@/lib/api';

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    Promise.all([fetchMyEnrollments(), fetchMyAttempts()])
      .then(([e, a]) => {
        setEnrollments(e);
        setAttempts(a);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Dashboard</h1>
          <p className="text-slate-600">Track your learning and test performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="card p-6">
            <div className="text-sm text-slate-500 mb-1">Enrolled Courses</div>
            <div className="text-3xl font-bold text-indigo-600">{enrollments.length}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm text-slate-500 mb-1">Tests Attempted</div>
            <div className="text-3xl font-bold text-amber-600">{attempts.length}</div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">My Courses</h2>
          {enrollments.length === 0 ? (
            <div className="card p-8 text-center text-slate-600">
              <p className="mb-4">You have not enrolled in any courses yet.</p>
              <Link href="/courses" className="btn-primary inline-block">Browse Courses</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((e: any) => (
                <Link key={e.id} href={`/courses/${e.course.id}`} className="card card-hover p-6 block">
                  <h3 className="font-semibold text-slate-900 mb-2">{e.course.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{e.course.description}</p>
                  <div className="text-xs text-slate-500 pt-3 border-t border-gray-100">
                    Enrolled {new Date(e.enrolledAt).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Tests</h2>
          {attempts.length === 0 ? (
            <div className="card p-8 text-center text-slate-600">
              <p className="mb-4">No tests attempted yet.</p>
              <Link href="/tests" className="btn-primary inline-block">Take a Test</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {attempts.slice(0, 5).map((a: any) => (
                <div key={a.id} className="card p-5 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-slate-900">{a.test?.title}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(a.startedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    {a.score !== null ? (
                      <div className="text-2xl font-bold text-indigo-600">{a.score}</div>
                    ) : (
                      <span className="badge badge-warning">In Progress</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
