import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import { fetchBlogs } from '@/lib/api';

export default async function BlogsPage() {
  const { items } = await fetchBlogs({ take: 50 });

  return (
    <main className="min-h-screen">
      <PublicNav />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-gray-600 mb-8">
          Tips, strategies, and insights for competitive exams
        </p>

        {items.length === 0 ? (
          <p className="text-gray-500">No blog posts yet.</p>
        ) : (
          <div className="space-y-6">
            {items.map((item: any) => (
              <Link
                key={item.id}
                href={`/blogs/${item.slug}`}
                className="block border rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                {item.excerpt && (
                  <p className="text-gray-600 text-sm">{item.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
