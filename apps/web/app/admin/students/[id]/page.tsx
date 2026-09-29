'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchStudent, updateStudentRole } from '@/lib/api';

export default function AdminStudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const d = await fetchStudent(id);
    setData(d);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [id]);

  async function handleRoleChange(newRole: string) {
    if (!confirm(`Change role to ${newRole}?`)) return;
    setSaving(true);
    setError('');
    try {
      await updateStudentRole(id, newRole);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>User not found.</p>;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/students" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
        ← Back to users
      </Link>

      <div className="card p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-3xl flex-shrink-0">
            {data.fullName?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{data.fullName}</h1>
            <p className="text-slate-600 mb-3">{data.email}</p>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-primary">{data.role}</span>
              <span className="text-xs text-slate-500">
                Joined {new Date(data.createdAt).toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="text-xs text-slate-500 mb-1">Courses</div>
          <div className="text-2xl font-bold text-indigo-600">{data.enrollments?.length || 0}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500 mb-1">Test Attempts</div>
          <div className="text-2xl font-bold text-amber-600">{data.stats?.attempts || 0}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500 mb-1">Certificates</div>
          <div className="text-2xl font-bold text-emerald-600">{data.stats?.certificates || 0}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500 mb-1">Doubts</div>
          <div className="text-2xl font-bold text-purple-600">{data.stats?.doubts || 0}</div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Change Role</h2>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <div className="flex flex-wrap gap-2">
          {['STUDENT', 'INSTRUCTOR', 'ADMIN', 'SUPERADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => handleRoleChange(r)}
              disabled={saving || data.role === r}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                data.role === r
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-slate-700 hover:border-indigo-500'
              }`}
            >
              {r} {data.role === r && '✓'}
            </button>
          ))}
        </div>
      </div>

      {data.enrollments?.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Enrolled Courses</h2>
          <div className="space-y-2">
            {data.enrollments.map((e: any) => (
              <div key={e.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900">{e.course.title}</div>
                  <div className="text-xs text-slate-500">
                    Enrolled {new Date(e.enrolledAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <Link href={`/courses/${e.course.id}`} className="text-indigo-600 text-sm hover:underline">
                  View →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
