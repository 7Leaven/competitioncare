'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchTests, deleteTest } from '@/lib/api';

type Test = {
  id: string;
  title: string;
  duration: number;
  _count?: { questions: number };
};

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      const data = await fetchTests();
      setTests(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      try {
        const data = await fetchTests();
        if (!active) return;
        setTests(data);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteTest(id);
      void load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tests</h1>
        <Link
          href="/admin/tests/new"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + New Test
        </Link>
      </div>

      {tests.length === 0 ? (
        <p className="text-gray-500">No tests yet.</p>
      ) : (
        <table className="w-full border rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Duration</th>
              <th className="text-left p-3">Questions</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-3">{t.title}</td>
                <td className="p-3">{t.duration} min</td>
                <td className="p-3">{t._count?.questions ?? 0}</td>
                <td className="p-3">
                  <Link
                    href={`/admin/tests/${t.id}`}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Manage
                  </Link>
                  <button
                    onClick={() => handleDelete(t.id, t.title)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
