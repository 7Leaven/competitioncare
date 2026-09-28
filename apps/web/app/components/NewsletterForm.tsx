'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/lib/api';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      await subscribeNewsletter(email);
      setMessage('Subscribed! Check your inbox for updates.');
      setEmail('');
    } catch (err) {
      setIsError(true);
      setMessage(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full sm:flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-w-0"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? '...' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p className={`text-xs mt-2 ${isError ? 'text-red-400' : 'text-emerald-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
}