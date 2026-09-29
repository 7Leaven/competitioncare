'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchTest, bulkImportQuestions } from '@/lib/api';

type ParsedQuestion = {
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  marks?: number;
};

function parseCSV(text: string): ParsedQuestion[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row');

  const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const idxText = header.indexOf('question');
  const idxA = header.indexOf('optiona');
  const idxB = header.indexOf('optionb');
  const idxC = header.indexOf('optionc');
  const idxD = header.indexOf('optiond');
  const idxCorrect = header.indexOf('correctoption');
  const idxExplanation = header.indexOf('explanation');
  const idxMarks = header.indexOf('marks');

  if (idxText < 0 || idxA < 0 || idxB < 0 || idxC < 0 || idxD < 0 || idxCorrect < 0) {
    throw new Error(
      'CSV header must include: question, optionA, optionB, optionC, optionD, correctOption',
    );
  }

  const questions: ParsedQuestion[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(',').map((p) => p.trim());

    const correctLetter = parts[idxCorrect]?.toUpperCase();
    const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    const correctOption = letterMap[correctLetter];
    if (correctOption === undefined) {
      throw new Error(`Row ${i + 1}: correctOption must be A, B, C, or D`);
    }

    questions.push({
      text: parts[idxText] || '',
      options: [parts[idxA] || '', parts[idxB] || '', parts[idxC] || '', parts[idxD] || ''],
      correctOption,
      explanation: idxExplanation >= 0 ? parts[idxExplanation] : undefined,
      marks: idxMarks >= 0 ? parseInt(parts[idxMarks], 10) || 1 : 1,
    });
  }

  return questions;
}

function parseJSON(text: string): ParsedQuestion[] {
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error('JSON must be an array of questions');
  return parsed.map((q: any) => ({
    text: q.text || q.question,
    options: q.options || [q.optionA, q.optionB, q.optionC, q.optionD],
    correctOption:
      typeof q.correctOption === 'number'
        ? q.correctOption
        : { A: 0, B: 1, C: 2, D: 3 }[String(q.correctOption).toUpperCase()] ?? 0,
    explanation: q.explanation,
    marks: q.marks ?? 1,
  }));
}

export default function BulkImportPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [mode, setMode] = useState<'csv' | 'json'>('csv');
  const [input, setInput] = useState('');
  const [testTitle, setTestTitle] = useState('');
  const [preview, setPreview] = useState<ParsedQuestion[]>([]);
  const [previewError, setPreviewError] = useState('');
  const [importing, setImporting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTest(testId).then((t) => {
      if (t) setTestTitle(t.title);
    });
  }, [testId]);

  function handlePreview() {
    setPreviewError('');
    setPreview([]);
    try {
      const questions = mode === 'csv' ? parseCSV(input) : parseJSON(input);
      if (questions.length === 0) throw new Error('No questions found');
      if (questions.length > 500) throw new Error('Maximum 500 questions per import');
      setPreview(questions);
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : 'Parse error');
    }
  }

  async function handleImport() {
    if (preview.length === 0) return;
    setImporting(true);
    try {
      const result = await bulkImportQuestions(testId, preview);
      setSuccess(`Imported ${result.inserted} questions. Total marks: ${result.totalMarks}`);
      setTimeout(() => {
        router.push(`/admin/tests/${testId}`);
      }, 1500);
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : 'Import failed');
      setImporting(false);
    }
  }

  const csvExample = `question,optionA,optionB,optionC,optionD,correctOption,explanation,marks
What is 2+2?,1,3,4,5,C,Basic arithmetic,1
Capital of India?,Mumbai,Delhi,Kolkata,Chennai,B,New Delhi is the capital,1`;

  const jsonExample = `[
  {
    "text": "What is 2+2?",
    "options": ["1", "3", "4", "5"],
    "correctOption": 2,
    "explanation": "Basic arithmetic",
    "marks": 1
  }
]`;

  return (
    <div className="max-w-4xl">
      <Link
        href={`/admin/tests/${testId}`}
        className="text-indigo-600 hover:underline text-sm mb-2 inline-block"
      >
        ← Back to test
      </Link>

      <h1 className="text-3xl font-bold mb-2">Bulk Import Questions</h1>
      <p className="text-slate-600 mb-6">Adding to: <strong>{testTitle}</strong></p>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <div className="card p-6 mb-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setMode('csv');
              setInput('');
              setPreview([]);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'csv' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200'
            }`}
          >
            CSV
          </button>
          <button
            onClick={() => {
              setMode('json');
              setInput('');
              setPreview([]);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'json' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200'
            }`}
          >
            JSON
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-3">
          {mode === 'csv'
            ? 'Paste CSV. Column order: question, optionA, optionB, optionC, optionD, correctOption (A/B/C/D), explanation, marks'
            : 'Paste a JSON array of question objects'}
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={12}
          className="input font-mono text-xs mb-3"
          placeholder={mode === 'csv' ? csvExample : jsonExample}
        />

        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            disabled={!input.trim()}
            className="btn-secondary"
          >
            Preview
          </button>
          <button
            onClick={() => setInput(mode === 'csv' ? csvExample : jsonExample)}
            className="text-sm text-indigo-600 hover:underline"
          >
            Load example
          </button>
        </div>
      </div>

      {previewError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {previewError}
        </div>
      )}

      {preview.length > 0 && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Preview ({preview.length} questions)
            </h2>
            <button
              onClick={handleImport}
              disabled={importing}
              className="btn-primary"
            >
              {importing ? 'Importing...' : `Import ${preview.length} Questions`}
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {preview.slice(0, 20).map((q, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-3 text-sm">
                <div className="font-medium text-slate-900 mb-1">
                  Q{i + 1}: {q.text}
                </div>
                <div className="text-xs text-slate-600 space-y-0.5 ml-3">
                  {q.options.map((opt, oi) => (
                    <div
                      key={oi}
                      className={oi === q.correctOption ? 'text-emerald-700 font-semibold' : ''}
                    >
                      {String.fromCharCode(65 + oi)}. {opt}
                      {oi === q.correctOption && ' ✓'}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div className="text-xs text-slate-500 mt-2 italic">
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}
            {preview.length > 20 && (
              <div className="text-sm text-slate-500 text-center py-2">
                ...and {preview.length - 20} more questions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


