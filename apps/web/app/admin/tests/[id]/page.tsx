'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchTest, deleteQuestion } from '@/lib/api';

export default function ManageTestPage() {
  const params = useParams();
  const id = params.id as string;

  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await fetchTest(id);
      if (!data) throw new Error('Test not found');
      setTest(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleDeleteQuestion(qid: string) {
    if (!confirm('Delete this question?')) return;
    try {
      await deleteQuestion(qid);
      load();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!test) return null;

  return (
    <div>
      <Link href="/admin/tests" className="text-blue-600 hover:underline mb-4 inline-block">
        Back to tests
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
        <p className="text-gray-600 mb-1">{test.description || 'No description'}</p>
        <p className="text-sm text-gray-500">
          {test.duration} min - {test.questions?.length ?? 0} questions
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Questions</h2>
        <Link
          href={`/admin/tests/${id}/questions/new`}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          + Add Question
        </Link>
      </div>

      {(!test.questions || test.questions.length === 0) ? (
        <p className="text-gray-500">No questions yet. Add one to get started.</p>
      ) : (
        <div className="space-y-3">
          {test.questions.map((q: any, i: number) => (
            <div key={q.id} className="border rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">
                  Q{i + 1}: {q.text}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{q.marks} mark(s)</span>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-700 ml-4 space-y-1">
                {(q.options || []).map((opt: string, oi: number) => (
                  <div key={oi} className={oi === q.correctOption ? "text-green-700 font-medium" : ""}>
                    {String.fromCharCode(65 + oi)}. {opt}
                    {oi === q.correctOption && ' (correct)'}
                  </div>
                ))}
              </div>
              {q.explanation && (
                <p className="text-sm text-gray-500 mt-2 italic">
                  Explanation: {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

