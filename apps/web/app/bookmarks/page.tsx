'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchBookmarks, removeBookmark } from '@/lib/api';

type Bookmark = {
  id: string;
  itemType: string;
  itemId: string;
  createdAt: string;
  item: any;
};

const TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'COURSE', label: 'Courses' },
  { key: 'TEST', label: 'Tests' },
  { key: 'CURRENT_AFFAIR', label: 'Current Affairs' },
  { key: 'BLOG', label: 'Blog' },
  { key: 'RESOURCE', label: 'Resources' },
];

export default function BookmarksPage() {
  const [items, setItems] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('ALL');

  async function load() {
    const data = await fetchBookmarks();
    setItems(data.items);
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

  async function handleRemove(itemType: string, itemId: string) {
    if (!confirm('Remove this bookmark?')) return;
    await removeBookmark(itemType, itemId);
    await load();
  }

  const filtered = useMemo(() => {
    if (tab === 'ALL') return items;
    return items.filter((b) => b.itemType === tab);
  }, [items, tab]);

  function hrefFor(b: Bookmark) {
    if (b.itemType === 'COURSE') return `/courses/${b.item.id}`;
    if (b.itemType === 'TEST') return `/tests/${b.item.id}`;
    if (b.itemType === 'CURRENT_AFFAIR') return `/current-affairs/${b.item.slug}`;
    if (b.itemType === 'BLOG') return `/blogs/${b.item.slug}`;
    if (b.itemType === 'RESOURCE') return `/resources`;
    return '#';
  }

  function labelFor(type: string) {
    return {
      COURSE: 'Course',
      TEST: 'Test',
      CURRENT_AFFAIR: 'Current Affairs',
      BLOG: 'Blog',
      RESOURCE: 'Resource',
    }[type] || type;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNav />
        <div className="container-page py-12 flex-1 text-center text-slate-500">Loading bookmarks...</div>
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Bookmarks</h1>
          <p className="text-slate-600">Saved items for later.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => {
            const count = t.key === 'ALL' ? items.length : items.filter((b) => b.itemType === t.key).length;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  tab === t.key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-slate-600 hover:border-indigo-500'
                }`}
              >
                {t.label} {count > 0 && <span className="ml-1 opacity-75">({count})</span>}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">🔖</div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              {items.length === 0 ? 'No bookmarks yet' : 'Nothing in this category'}
            </h2>
            <p className="text-slate-600 mb-6">
              {items.length === 0
                ? 'Bookmark courses, tests, and articles to see them here.'
                : 'Try a different tab.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => (
              <div key={b.id} className="card p-5 hover:shadow-md transition">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="badge badge-primary mb-2">{labelFor(b.itemType)}</span>
                    <Link href={hrefFor(b)} className="block">
                      <h3 className="font-semibold text-slate-900 hover:text-indigo-600 mb-1">
                        {b.item.title}
                      </h3>
                      {(b.item.description || b.item.summary || b.item.excerpt) && (
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {b.item.description || b.item.summary || b.item.excerpt}
                        </p>
                      )}
                    </Link>
                    <div className="text-xs text-slate-500 mt-2">
                      Saved {new Date(b.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Link href={hrefFor(b)} className="btn-secondary text-xs whitespace-nowrap">
                      Open
                    </Link>
                    <button
                      onClick={() => handleRemove(b.itemType, b.itemId)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}