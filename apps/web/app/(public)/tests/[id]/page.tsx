import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchTest } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function TestDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const test = await fetchTest(id);
  if (!test) return notFound();
  const questionCount = test.questions?.length ?? 0;

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1 max-w-3xl">
        <Link href="/tests" className="text-indigo-600 hover:underline mb-6 inline-block text-sm">← Back to tests</Link>

        <div className="card p-8 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">{test.title}</h1>
          <p className="text-slate-600 mb-6">{test.description || 'Practice test to sharpen your skills.'}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="text-sm text-indigo-600 font-medium mb-1">Duration</div>
              <div className="text-2xl font-bold text-slate-900">{test.duration} min</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="text-sm text-amber-600 font-medium mb-1">Questions</div>
              <div className="text-2xl font-bold text-slate-900">{questionCount}</div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-4">Instructions</h2>
          <ul className="space-y-3 text-slate-700 mb-8">
            <li className="flex gap-2"><span className="text-indigo-600">•</span> The test has a time limit of {test.duration} minutes.</li>
            <li className="flex gap-2"><span className="text-indigo-600">•</span> You can attempt all questions in any order.</li>
            <li className="flex gap-2"><span className="text-indigo-600">•</span> Answers cannot be changed after submission.</li>
            <li className="flex gap-2"><span className="text-indigo-600">•</span> Your score will be calculated automatically.</li>
          </ul>

          <Link href={`/tests/${test.id}/take`} className="btn-primary inline-block text-center w-full py-3">Start Test</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
