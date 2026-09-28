'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAllDoubts } from '@/lib/api';

export default function AdminDoubtsPage() {
  const [doubts, setDoubts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'ANSWERED'>('ALL');

  useEffect(() => {
    fetchAllDoubts()
      .then(setDoubts)
      .finally(() => setLoading(false));
  }, []);

  const filtered = doubts.filter((d) => {
    if (filter === 'ALL') return true;
    if (filter === 'OPEN') return d.status === 'OPEN';
    return d.status === 'ANSWERED';
  });

  const openCount = doubts.filter((d) => d.status === 'OPEN').length;
  const answeredCount = doubts.filter((d) => d.status === 'ANSWERED').length;

  if (loading) return <p>Loading doubts...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Doubts</h1>
        <p className="text-slate-600 mt-1">Answer student questions.</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 hover:border-indigo-500'
          }`}
        >
          All ({doubts.length})
        </button>
        <button
          onClick={() => setFilter('OPEN')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'OPEN' ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 hover:border-amber-500'
          }`}
        >
          Open ({openCount})
        </button>
        <button
          onClick={() => setFilter('ANSWERED')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'ANSWERED' ? 'bg-emerald-500 text-white' : 'bg-white border border-gray-200 hover:border-emerald-500'
          }`}
        >
          Answered ({answeredCount})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">No doubts to display.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <div key={d.id} className="card p-5">
              <div className="flex justify-between items-start gap-3 mb-2">
                <div>
                  <span className={`badge ${d.status === 'ANSWERED' ? 'badge-success' : 'badge-warning'}`}>
                    {d.status}
                  </span>
                  <span className="text-xs text-slate-500 ml-2">
                    {new Date(d.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <Link
                  href={`/admin/doubts/${d.id}`}
                  className="text-indigo-600 hover:underline text-sm font-medium whitespace-nowrap"
                >
                  {d.status === 'ANSWERED' ? 'View' : 'Answer'} →
                </Link>
              </div>

              <div className="text-sm font-semibold text-indigo-600 mb-1">{d.subject}</div>
              <p className="text-slate-800 text-sm mb-2 line-clamp-2">{d.question}</p>
              {d.user && (
                <div className="text-xs text-slate-500">
                  From: {d.user.fullName} ({d.user.email})
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}