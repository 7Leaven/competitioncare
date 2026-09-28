'use client';

import { useEffect, useState } from 'react';
import {
  fetchNewsletterSubscribers,
  fetchNewsletterCount,
  deleteNewsletterSubscriber,
} from '@/lib/api';

export default function AdminNewsletterPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [counts, setCounts] = useState({ total: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function load() {
    const [list, c] = await Promise.all([
      fetchNewsletterSubscribers(),
      fetchNewsletterCount(),
    ]);
    setSubs(list);
    setCounts(c);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleDelete(id: string, email: string) {
    if (!confirm(`Delete subscriber ${email}?`)) return;
    await deleteNewsletterSubscriber(id);
    await load();
  }

  const filtered = subs.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name && s.name.toLowerCase().includes(search.toLowerCase())),
  );

  if (loading) return <p>Loading subscribers...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
        <p className="text-slate-600 mt-1">
          {counts.active} active · {counts.total} total
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
        <div className="card p-4">
          <div className="text-xs text-slate-500 mb-1">Active</div>
          <div className="text-2xl font-bold text-emerald-600">{counts.active}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-slate-500 mb-1">Total</div>
          <div className="text-2xl font-bold text-indigo-600">{counts.total}</div>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by email or name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input mb-4 max-w-md"
      />

      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">
          {subs.length === 0 ? 'No subscribers yet.' : 'No subscribers match your search.'}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Email</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Name</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Subscribed</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 font-medium text-slate-900">{s.email}</td>
                  <td className="p-3 text-slate-600">{s.name || '—'}</td>
                  <td className="p-3">
                    <span className={`badge ${s.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-slate-500">
                    {new Date(s.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(s.id, s.email)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
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