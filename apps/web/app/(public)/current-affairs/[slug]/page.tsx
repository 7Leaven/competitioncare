import Link from 'next/link';
import { fetchCurrentAffair } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function CurrentAffairDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await fetchCurrentAffair(slug);
  if (!item) return notFound();

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <Link
        href="/current-affairs"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        Back to current affairs
      </Link>

      <div className="mb-2">
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
          {item.category}
        </span>
        <span className="text-sm text-gray-500 ml-3">
          {new Date(item.publishedAt).toLocaleDateString()}
        </span>
      </div>

      <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
      {item.summary && (
        <p className="text-lg text-gray-700 mb-6 italic">{item.summary}</p>
      )}

      <div className="prose max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
        {item.content}
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="mt-8 pt-4 border-t">
          <span className="text-sm text-gray-500 mr-2">Tags:</span>
          {item.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-100 rounded mr-2"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </main>
  );
}

