'use client';

import { useEffect, useState } from 'react';
import { fetchActivityLogs, fetchActivityActions } from '@/lib/api';

type Log = {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  metadata: unknown;
  ipAddress: string | null;
  createdAt: string;
  user: { id: string; email: string; fullName: string; role: string };
};

export default function ActivityLogsPage() {
  const [items, setItems] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [actions, setActions] = useState<string[]>([]);
  const [actionFilter, setActionFilter] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [data, acts] = await Promise.all([
      fetchActivityLogs({ action: actionFilter || undefined, take: 100 }),
      fetchActivityActions(),
    ]);
    setItems(data.items || []);
    setTotal(data.total || 0);
    setActions(acts || []);
    setLoading(false);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [actionFilter]);

  function actionColor(action: string) {
    if (action.includes('DELETE')) return 'bg-red-100 text-red-700';
    if (action.includes('CREATE')) return 'bg-emerald-100 text-emerald-700';
    if (action.includes('UPDATE') || action.includes('CHANGE')) return 'bg-amber-100 text-amber-700';
    if (action.includes('PUBLISH')) return 'bg-indigo-100 text-indigo-700';
    return 'bg-slate-100 text-slate-700';
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Activity Logs</h1>
        <p className="text-slate-600 mt-1">{total} events recorded</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="input max-w-xs"
        >
          <option value="">All actions</option>
          {actions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">No activity logged yet.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">When</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">User</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Action</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Entity</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Details</th>
              </tr>
            </thead>
            <tbody>
              {items.map((log) => (
                <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    <div className="text-sm font-medium text-slate-900">
                      {log.user?.fullName || '—'}
                    </div>
                    <div className="text-xs text-slate-500">{log.user?.email}</div>
                  </td>
                  <td className="p-3">
                    <span className={`badge ${actionColor(log.action)}`}>{log.action}</span>
                  </td>
                  <td className="p-3 text-sm text-slate-600">
                    {log.entity || '—'}
                    {log.entityId && (
                      <span className="text-xs text-slate-400 ml-1">
                        {log.entityId.slice(0, 8)}…
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-xs text-slate-500 max-w-xs truncate">
                    {log.metadata ? JSON.stringify(log.metadata) : '—'}
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