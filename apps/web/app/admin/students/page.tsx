'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchStudents, fetchStudentStats } from '@/lib/api';

type Student = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
  _count?: { enrollments: number };
};

export default function AdminStudentsPage() {
  const [items, setItems] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ total: 0, students: 0, admins: 0, last30Days: 0, last7Days: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  async function load() {
    setLoading(true);
    const [data, s] = await Promise.all([
      fetchStudents({ search, role: roleFilter || undefined }),
      fetchStudentStats(),
    ]);
    setItems(data.items);
    setTotal(data.total);
    setStats(s);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [search, roleFilter]);

  const roleBadge = (role: string) => {
    const map: any = {
      STUDENT: 'badge-primary',
      INSTRUCTOR: 'badge-warning',
      ADMIN: 'badge-success',
      SUPERADMIN: 'badge-danger',
    };
    return map[role] || 'badge-primary';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Students & Users</h1>
        <p className="text-slate-600 mt-1">{total} total users</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card p-4">
          <div className="text-xs text-slate-500 mb-1">Total</div>
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500 mb-1">Students</div>
          <div className="text-2xl font-bold text-indigo-600">{stats.students}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500 mb-1">Admins</div>
          <div className="text-2xl font-bold text-emerald-600">{stats.admins}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500 mb-1">Last 30 days</div>
          <div className="text-2xl font-bold text-amber-600">{stats.last30Days}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500 mb-1">Last 7 days</div>
          <div className="text-2xl font-bold text-purple-600">{stats.last7Days}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by email or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input flex-1 max-w-md"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="input max-w-xs"
        >
          <option value="">All roles</option>
          <option value="STUDENT">Students</option>
          <option value="INSTRUCTOR">Instructors</option>
          <option value="ADMIN">Admins</option>
          <option value="SUPERADMIN">Super Admins</option>
        </select>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">No users found.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Name</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Email</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Role</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Courses</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Joined</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {u.fullName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="font-medium text-slate-900">{u.fullName}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-600 text-sm">{u.email}</td>
                  <td className="p-3">
                    <span className={`badge ${roleBadge(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="p-3 text-slate-600 text-sm">{u._count?.enrollments || 0}</td>
                  <td className="p-3 text-slate-500 text-sm">
                    {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/admin/students/${u.id}`}
                      className="text-indigo-600 hover:underline text-sm font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
