import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import { fetchResources } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default async function ResourcesPage() {
  const { items } = await fetchResources({ take: 50 });

  return (
    <main className="min-h-screen">
      <PublicNav />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Resources</h1>
        <p className="text-gray-600 mb-8">
          Download study materials, notes, and previous year papers
        </p>

        {items.length === 0 ? (
          <p className="text-gray-500">No resources yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item: any) => {
              const fullUrl = API_URL + item.fileUrl;
              return (
                <div
                  key={item.id}
                  className="border rounded-lg p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.downloadCount} downloads
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  )}
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
                  >
                    Download
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
