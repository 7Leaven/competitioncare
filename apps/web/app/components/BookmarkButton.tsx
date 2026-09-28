'use client';

import { useEffect, useState } from 'react';
import { checkBookmark, addBookmark, removeBookmark } from '@/lib/api';

export default function BookmarkButton({
  itemType,
  itemId,
}: {
  itemType: 'COURSE' | 'TEST' | 'CURRENT_AFFAIR' | 'BLOG' | 'RESOURCE';
  itemId: string;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    checkBookmark(itemType, itemId)
      .then((data) => setBookmarked(data.bookmarked))
      .finally(() => setLoading(false));
  }, [itemType, itemId]);

  async function toggle() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    setSaving(true);
    try {
      if (bookmarked) {
        await removeBookmark(itemType, itemId);
        setBookmarked(false);
      } else {
        await addBookmark(itemType, itemId);
        setBookmarked(true);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
        bookmarked
          ? 'bg-amber-50 text-amber-700 border border-amber-300'
          : 'bg-white text-slate-700 border border-gray-200 hover:border-amber-400 hover:text-amber-700'
      }`}
    >
      <svg
        className="w-4 h-4"
        fill={bookmarked ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
}