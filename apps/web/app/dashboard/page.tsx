'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchMyEnrollments } from '@/lib/api';

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchMyEnrollments()
      .then(setEnrollments)
      .finally(() => setLoading(false));
  }, []);

  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  if (loading) return <main className="p-8">Loading...</main>;

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <button
          onClick={logout}
          className="text-sm text-gray-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {enrollments.length === 0 ? (
        <div>
          <p className="text-gray-500 mb-4">
            You haven't enrolled in any courses yet.
          </p>
          <Link href="/courses" className="text-blue-600 hover:underline">
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((e: any) => (
            <Link
              key={e.id}
              href={`/courses/${e.course.id}`}
              className="block border rounded-lg p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{e.course.title}</h2>
              <p className="text-gray-600 text-sm mb-4">
                {e.course.description}
              </p>
              <span className="text-xs text-gray-500">
                Enrolled {new Date(e.enrolledAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}


