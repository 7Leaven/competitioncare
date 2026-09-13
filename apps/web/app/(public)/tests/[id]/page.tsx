import Link from 'next/link';
import { fetchTest } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const test = await fetchTest(id);
  if (!test) return notFound();

  const questionCount = test.questions?.length ?? 0;

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <Link
        href="/tests"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        Back to tests
      </Link>

      <h1 className="text-4xl font-bold mb-4">{test.title}</h1>
      <p className="text-gray-600 mb-6">
        {test.description || 'No description available.'}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border rounded-lg p-4">
          <span className="text-sm text-gray-500">Duration</span>
          <p className="text-xl font-bold">{test.duration} min</p>
        </div>
        <div className="border rounded-lg p-4">
          <span className="text-sm text-gray-500">Questions</span>
          <p className="text-xl font-bold">{questionCount}</p>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>The test has a time limit of {test.duration} minutes.</li>
          <li>You can attempt all questions in any order.</li>
          <li>Click Submit when you finish. Answers cannot be changed after submission.</li>
          <li>Your score will be calculated automatically.</li>
        </ul>

        <Link
          href={`/tests/${test.id}/take`}
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Start Test
        </Link>
      </div>
    </main>
  );
}


