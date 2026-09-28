'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchLesson, updateLesson } from '@/lib/api';

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [notesUrl, setNotesUrl] = useState('');
  const [notesLabel, setNotesLabel] = useState('');
  const [moduleTitle, setModuleTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLesson(id)
      .then((data) => {
        if (!data) return;
        setTitle(data.title || '');
        setContent(data.content || '');
        setVideoUrl(data.videoUrl || '');
        setNotesUrl(data.notesUrl || '');
        setNotesLabel(data.notesLabel || '');
        setModuleTitle(data.module?.title || '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateLesson(id, { title, content, videoUrl, notesUrl, notesLabel });
      setSuccess('Lesson updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/courses" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
        ← Back to courses
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Lesson</h1>
      <p className="text-slate-600 mb-8">Module: {moduleTitle}</p>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg mb-4 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 mb-1 block">Title</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="input" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 mb-1 block">Video URL (YouTube, Vimeo, or direct)</span>
          <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input" placeholder="https://youtube.com/watch?v=..." />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 mb-1 block">Content (reading material)</span>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="input font-mono text-sm" />
        </label>

        <div className="border-t border-gray-100 pt-5">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Downloadable Notes</h2>

          <label className="block mb-4">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Notes URL (PDF or document link)</span>
            <input
              type="text"
              value={notesUrl}
              onChange={(e) => setNotesUrl(e.target.value)}
              className="input"
              placeholder="https://example.com/notes.pdf or /uploads/file.pdf"
            />
            <span className="text-xs text-slate-500 mt-1 block">
              Paste an external URL, or upload via Resources and paste the /uploads/... path.
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Button Label (optional)</span>
            <input
              type="text"
              value={notesLabel}
              onChange={(e) => setNotesLabel(e.target.value)}
              className="input"
              placeholder="Download Notes (default)"
            />
          </label>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}