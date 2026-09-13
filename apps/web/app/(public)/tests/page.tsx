import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchTests } from '@/lib/api';

export default async function TestsPage() {
  const tests = await fetchTests();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Test Series</h1>
          <p className="text-slate-600 text-lg">Practice with real exam-like mock tests.</p>
        </div>

        {tests.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-slate-600">No tests available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test: any) => (
              <Link key={test.id} href={`/tests/${test.id}`} className="card card-hover p-6 block">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">{test.title}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{test.description || 'Full-length practice test'}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500 pt-4 border-t border-gray-100">
                  <span>⏱ {test.duration} min</span>
                  <span>❓ {test._count?.questions ?? 0} questions</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
