'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { search as searchApi } from '@/lib/api';

type Result = {
  courses: any[];
  tests: any[];
  currentAffairs: any[];
  blogs: any[];
  resources: any[];
  total: number;
};

function SearchResults() {
  const params = useSearchParams();
  const q = params.get('q') || '';
  const [results, setResults] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q.length < 2) {
      setLoading(false);
      return;
    }
    setLoading(true);
    searchApi(q)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [q]);

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Searching...</div>;
  }

  if (q.length < 2) {
    return (
      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-slate-600">Type at least 2 characters to search.</p>
      </div>
    );
  }

  if (!results || results.total === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">No results found</h2>
        <p className="text-slate-600">No matches for "{q}". Try different keywords.</p>
      </div>
    );
  }

  const sections = [
    { key: 'courses', label: 'Courses', items: results.courses, href: (r: any) => `/courses/${r.id}`, sub: (r: any) => r.description },
    { key: 'tests', label: 'Tests', items: results.tests, href: (r: any) => `/tests/${r.id}`, sub: (r: any) => r.description },
    { key: 'currentAffairs', label: 'Current Affairs', items: results.currentAffairs, href: (r: any) => `/current-affairs/${r.slug}`, sub: (r: any) => r.summary },
    { key: 'blogs', label: 'Blog', items: results.blogs, href: (r: any) => `/blogs/${r.slug}`, sub: (r: any) => r.excerpt },
    { key: 'resources', label: 'Resources', items: results.resources, href: (r: any) => `/resources`, sub: (r: any) => r.description },
  ];

  return (
    <div className="space-y-8">
      <div className="text-slate-600">
        Found <span className="font-semibold text-slate-900">{results.total}</span> result{results.total !== 1 ? 's' : ''} for "{q}"
      </div>

      {sections.filter((s) => s.items.length > 0).map((s) => (
        <section key={s.key}>
          <h2 className="text-xl font-bold text-slate-900 mb-4">{s.label}</h2>
          <div className="space-y-3">
            {s.items.map((r: any) => (
              <Link key={r.id} href={s.href(r)} className="card card-hover p-4 block">
                <div className="font-semibold text-slate-900 mb-1">{r.title}</div>
                {s.sub(r) && <p className="text-sm text-slate-600 line-clamp-2">{s.sub(r)}</p>}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1 max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Search</h1>
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}>
          <SearchResults />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}