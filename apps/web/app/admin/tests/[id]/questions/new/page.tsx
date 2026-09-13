'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createQuestion } from '@/lib/api';

export default function NewQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [marks, setMarks] = useState(1);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function updateOption(index: number, value: string) {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (options.some((o) => !o.trim())) {
      setError('All options must be filled');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await createQuestion(testId, {
        text,
        options,
        correctOption,
        explanation,
        marks,
      });
      router.push(`/admin/tests/${testId}`);
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div>
      <Link
        href={`/admin/tests/${testId}`}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        Back to test
      </Link>
      <h1 className="text-3xl font-bold mb-6">Add Question</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <label className="block">
          <span className="text-sm font-medium">Question</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={3}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <div>
          <span className="text-sm font-medium block mb-2">
            Options (click radio to mark correct answer)
          </span>
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <input
                type="radio"
                name="correct"
                checked={correctOption === i}
                onChange={() => setCorrectOption(i)}
                className="w-4 h-4"
              />
              <span className="font-medium w-5">
                {String.fromCharCode(65 + i)}.
              </span>
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                required
                className="flex-1 border rounded px-3 py-2"
              />
            </div>
          ))}
        </div>

        <label className="block">
          <span className="text-sm font-medium">Explanation (optional)</span>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Marks</span>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
            min={1}
            required
            className="w-full border rounded px-3 py-2 mt-1 max-w-xs"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Add Question'}
        </button>
      </form>
    </div>
  );
}


