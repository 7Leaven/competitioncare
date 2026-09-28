import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchCurrentAffair } from '@/lib/api';
import { notFound } from 'next/navigation';
import BookmarkButton from '@/app/components/BookmarkButton';

export default async function CurrentAffairDetailPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await fetchCurrentAffair(slug);
  if (!item) return notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <article className="container-page py-12 flex-1 max-w-3xl">
        <Link href="/current-affairs" className="text-indigo-600 hover:underline mb-6 inline-block text-sm">
          ← Back to Current Affairs
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="badge badge-primary">{item.category}</span>
          <span className="text-sm text-slate-500">
            {new Date(item.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">{item.title}</h1>

        <div className="mb-6">
          <BookmarkButton itemType="CURRENT_AFFAIR" itemId={item.id} />
        </div>

        {item.summary && (
          <p className="text-lg text-slate-600 mb-8 italic border-l-4 border-indigo-500 pl-4">{item.summary}</p>
        )}

        <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-800 leading-relaxed">
          {item.content}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <span className="text-sm text-slate-500 mr-2">Tags:</span>
            {item.tags.map((tag: string) => (
              <span key={tag} className="badge badge-primary mr-2">{tag}</span>
            ))}
          </div>
        )}
      </article>
      <Footer />
    </div>
  );
}