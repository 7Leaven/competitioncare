'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { startAttempt, submitAttempt } from '@/lib/api';

type Question = {
  id: string;
  text: string;
  options: string[];
  marks: number;
  order: number;
};

type AttemptData = {
  attemptId: string;
  test: { id: string; title: string; duration: number };
  questions: Question[];
};

export default function TakeTestClient({ testId }: { testId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    startAttempt(testId)
      .then((data) => {
        setAttempt(data);
        setTimeLeft(data.test.duration * 60);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [testId, router]);

  useEffect(() => {
    if (timeLeft <= 0 || !attempt) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft > 0, attempt]);

  useEffect(() => {
    if (timeLeft !== 0 || !attempt || submittedRef.current) return;
    submittedRef.current = true;
    doSubmit();
  }, [timeLeft, attempt]);

  function selectOption(questionId: string, option: number) {
    setAnswers((a) => ({ ...a, [questionId]: option }));
  }

  async function doSubmit() {
    if (!attempt) return;
    setSubmitting(true);
    try {
      const answerArray = attempt.questions.map((q) => ({
        questionId: q.id,
        selectedOption: answers[q.id] ?? -1,
      }));
      await submitAttempt(attempt.attemptId, answerArray);
      router.push(`/tests/${testId}/result/${attempt.attemptId}`);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  function handleSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    doSubmit();
  }

  if (loading) return <main className="p-8">Loading test...</main>;
  if (error) return <main className="p-8 text-red-600">Error: {error}</main>;
  if (!attempt) return <main className="p-8">No test data</main>;

  const q = attempt.questions[current];
  const totalQuestions = attempt.questions.length;
  const answeredCount = Object.keys(answers).length;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">{attempt.test.title}</h1>
        <div className="text-right">
          <div className="text-sm text-gray-500">Time left</div>
          <div
            className={`text-2xl font-bold ${
              timeLeft < 60 ? 'text-red-600' : ''
            }`}
          >
            {String(minutes).padStart(2, '0')}:
            {String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6 mb-6">
        <div className="text-sm text-gray-500 mb-2">
          Question {current + 1} of {totalQuestions} - {q.marks} mark
          {q.marks !== 1 ? 's' : ''}
        </div>
        <h2 className="text-lg font-semibold mb-6">{q.text}</h2>

        <div className="space-y-3">
          {q.options.map((opt: string, i: number) => (
            <label
              key={i}
              className={`block p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                answers[q.id] === i ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <input
                type="radio"
                name={`q-${q.id}`}
                checked={answers[q.id] === i}
                onChange={() => selectOption(q.id, i)}
                className="mr-3"
              />
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrent(Math.min(totalQuestions - 1, current + 1))}
          disabled={current === totalQuestions - 1}
          className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="border rounded-lg p-6 mb-6">
        <h3 className="font-semibold mb-3">Question Palette</h3>
        <div className="flex flex-wrap gap-2">
          {attempt.questions.map((question, i) => (
            <button
              key={question.id}
              onClick={() => setCurrent(i)}
              className={`w-10 h-10 rounded border ${
                i === current
                  ? 'bg-blue-600 text-white'
                  : answers[question.id] !== undefined
                  ? 'bg-green-100 border-green-500'
                  : 'hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-500 mt-3">
          Answered: {answeredCount} / {totalQuestions}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Test'}
        </button>
      </div>
    </main>
  );
}

