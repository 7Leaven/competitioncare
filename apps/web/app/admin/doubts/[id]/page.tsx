'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { answerDoubt } from '@/lib/api';

export default function AdminDoubtDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [doubt, setDoubt] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3001/api/doubts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setDoubt(data);
      setAnswer(data.answer || '');
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await answerDoubt(id, answer);
      router.push('/admin/doubts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!doubt) return <p>Doubt not found.</p>;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/doubts" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
        ← Back to doubts
      </Link>

      <h1 className="text-3xl font-bold mb-2">Doubt Detail</h1>
      <p className="text-slate-600 mb-8">
        {new Date(doubt.createdAt).toLocaleString('en-IN')}
      </p>

      <div className="card p-6 mb-6">
        <div className="text-sm font-semibold text-indigo-600 mb-2">{doubt.subject}</div>
        <p className="text-slate-800 whitespace-pre-wrap">{doubt.question}</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Your Answer</h2>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          rows={8}
          className="input mb-4"
          placeholder="Write a clear, helpful answer..."
        />
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : doubt.answer ? 'Update Answer' : 'Submit Answer'}
        </button>
      </form>
    </div>
  );
}