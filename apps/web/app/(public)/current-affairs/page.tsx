import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import { fetchCurrentAffairs } from '@/lib/api';

export default async function CurrentAffairsPage() {
  const { items } = await fetchCurrentAffairs({ take: 50 });

  return (
    <main className="min-h-screen">
      <PublicNav />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Current Affairs</h1>
        <p className="text-gray-600 mb-8">
          Daily news and updates for competitive exams
        </p>

        {items.length === 0 ? (
          <p className="text-gray-500">No current affairs yet.</p>
        ) : (
          <div className="space-y-6">
            {items.map((item: any) => (
              <Link
                key={item.id}
                href={`/current-affairs/${item.slug}`}
                className="block border rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                {item.summary && (
                  <p className="text-gray-600 text-sm">{item.summary}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
