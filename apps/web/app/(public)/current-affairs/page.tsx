import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchCurrentAffairs } from '@/lib/api';

export default async function CurrentAffairsPage() {
  const { items } = await fetchCurrentAffairs({ take: 50 });

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Current Affairs</h1>
          <p className="text-slate-600 text-lg">Daily news and updates curated for competitive exams.</p>
        </div>

        {items.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📰</div>
            <p className="text-slate-600">No articles yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item: any) => (
              <Link key={item.id} href={`/current-affairs/${item.slug}`} className="card card-hover p-6 block">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <span className="badge badge-primary">{item.category}</span>
                  <span className="text-xs text-slate-500 whitespace-nowrap">{new Date(item.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h2>
                {item.summary && <p className="text-slate-600 text-sm leading-relaxed">{item.summary}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
