'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchMyDoubts, createDoubt } from '@/lib/api';

export default function DoubtsPage() {
  const [doubts, setDoubts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    const data = await fetchMyDoubts();
    setDoubts(data);
    setLoading(false);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    void load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await createDoubt(subject, question);
      setSubject('');
      setQuestion('');
      setSuccess('Doubt submitted. You will be notified when answered.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNav />
        <div className="container-page py-12 flex-1 text-center text-slate-500">Loading doubts...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1 max-w-4xl">
        <div className="mb-8">
          <Link href="/dashboard" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
            ← Back to dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Doubts</h1>
          <p className="text-slate-600">Ask questions and get answers from our expert team.</p>
        </div>

        <div className="card p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Ask a New Doubt</h2>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg mb-4 text-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Subject</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                maxLength={100}
                className="input"
                placeholder="e.g., Quantitative Aptitude - Percentages"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Your Question</span>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                rows={4}
                maxLength={2000}
                className="input"
                placeholder="Describe your doubt in detail..."
              />
            </label>

            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Submitting...' : 'Submit Doubt'}
            </button>
          </form>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">My Doubts ({doubts.length})</h2>

        {doubts.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-slate-600">No doubts yet. Ask your first question above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {doubts.map((d) => (
              <div key={d.id} className="card p-5">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div>
                    <span className={`badge ${d.status === 'ANSWERED' ? 'badge-success' : 'badge-warning'}`}>
                      {d.status === 'ANSWERED' ? 'Answered' : 'Pending'}
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                      {new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-semibold text-indigo-600 mb-1">{d.subject}</div>
                <p className="text-slate-800 mb-4 whitespace-pre-wrap">{d.question}</p>

                {d.answer && (
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
                    <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Answer</div>
                    <p className="text-slate-800 whitespace-pre-wrap">{d.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}