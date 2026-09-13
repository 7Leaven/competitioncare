import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import { fetchTests } from '@/lib/api';

export default async function TestsPage() {
  const tests = await fetchTests();

  return (
    <main className="min-h-screen">
      <PublicNav />
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test Series</h1>
        {tests.length === 0 ? (
          <p className="text-gray-500">No tests available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test: any) => (
              <Link
                key={test.id}
                href={`/tests/${test.id}`}
                className="block border rounded-lg p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">{test.title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  {test.description || 'No description'}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {test.duration} min - {test._count?.questions ?? 0} questions
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
