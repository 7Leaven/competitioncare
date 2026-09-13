'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchAttempt } from '@/lib/api';

export default function ResultPage() {
  const params = useParams();
  const testId = params.id as string;
  const attemptId = params.attemptId as string;

  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    fetchAttempt(attemptId)
      .then((data) => {
        if (!data) setError('Attempt not found');
        else setAttempt(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) return <main className="p-8">Loading result...</main>;
  if (error) return <main className="p-8 text-red-600">Error: {error}</main>;
  if (!attempt) return <main className="p-8">No result data</main>;

  const totalQuestions = attempt.answers?.length ?? 0;
  const correctCount =
    attempt.answers?.filter((a: any) => a.isCorrect).length ?? 0;
  const totalMarks =
    attempt.answers?.reduce(
      (sum: number, a: any) => sum + (a.question?.marks ?? 0),
      0,
    ) ?? 0;
  const score = attempt.score ?? 0;
  const percent = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto">
      <Link
        href="/tests"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        Back to tests
      </Link>

      <div className="border rounded-lg p-8 mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Test Complete!</h1>
        <p className="text-gray-600 mb-6">{attempt.test?.title}</p>

        <div className="text-6xl font-bold mb-2">
          {score}
          <span className="text-gray-400 text-3xl">/{totalMarks}</span>
        </div>
        <p className="text-gray-600 mb-6">
          {percent}% - {correctCount} of {totalQuestions} correct
        </p>

        <Link
          href={`/tests/${testId}/take`}
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Retake Test
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-4">Answer Review</h2>
      <div className="space-y-4">
        {attempt.answers?.map((ans: any, i: number) => {
          const options = ans.question?.options ?? [];
          return (
            <div
              key={ans.id}
              className={`border rounded-lg p-4 ${
                ans.isCorrect
                  ? 'border-green-300 bg-green-50'
                  : 'border-red-300 bg-red-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="font-semibold">
                  Q{i + 1}: {ans.question?.text}
                </span>
                <span
                  className={`text-sm font-bold ${
                    ans.isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {ans.isCorrect ? 'Correct' : 'Wrong'}
                </span>
              </div>

              <div className="text-sm text-gray-700 space-y-1 ml-4">
                {options.map((opt: string, oi: number) => {
                  const isUser = ans.selectedOption === oi;
                  const isCorrect = ans.question?.correctOption === oi;
                  let label = '';
                  if (isUser && isCorrect) label = ' (your answer, correct)';
                  else if (isCorrect) label = ' (correct answer)';
                  else if (isUser) label = ' (your answer)';
                  return (
                    <div key={oi}>
                      {String.fromCharCode(65 + oi)}. {opt}
                      <span className="text-xs text-gray-500">{label}</span>
                    </div>
                  );
                })}
              </div>

              {ans.question?.explanation && (
                <p className="text-sm text-gray-600 mt-3 italic">
                  <strong>Explanation:</strong> {ans.question.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

