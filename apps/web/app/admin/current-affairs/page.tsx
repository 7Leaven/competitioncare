'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCurrentAffairs, deleteCurrentAffair } from '@/lib/api';

type Item = {
  id: string;
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
};

export default function AdminCurrentAffairsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      const { items } = await fetchCurrentAffairs({ take: 100 });
      setItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteCurrentAffair(id);
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
        <h1 className="text-3xl font-bold">Current Affairs</h1>
        <Link
          href="/admin/current-affairs/new"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + New Article
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">No articles yet.</p>
      ) : (
        <table className="w-full border rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Published</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.title}</td>
                <td className="p-3 text-gray-500">{item.category}</td>
                <td className="p-3 text-gray-500 text-sm">
                  {new Date(item.publishedAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <Link
                    href={`/admin/current-affairs/${item.id}`}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
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

