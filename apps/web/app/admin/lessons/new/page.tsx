'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  fetchCourses,
  fetchCourseModules,
  createModule,
  createLesson,
} from '@/lib/api';

type Course = { id: string; title: string };
type Module = { id: string; title: string };

export default function NewLessonPage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [courseId, setCourseId] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [showNewModule, setShowNewModule] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [notesUrl, setNotesUrl] = useState('');
  const [notesLabel, setNotesLabel] = useState('');
  const [order, setOrder] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses()
      .then((data) => {
        setCourses(data);
        if (data.length > 0) setCourseId(data[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!courseId) return;
    setModules([]);
    setModuleId('');
    fetchCourseModules(courseId).then((data) => {
      setModules(data);
      if (data.length > 0) setModuleId(data[0].id);
    });
  }, [courseId]);

  async function handleCreateModule() {
    if (!courseId || !newModuleTitle.trim()) return;
    try {
      const mod = await createModule(courseId, newModuleTitle.trim(), modules.length);
      setModules([...modules, mod]);
      setModuleId(mod.id);
      setNewModuleTitle('');
      setShowNewModule(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create module');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!moduleId) {
      setError('Please select or create a module first');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await createLesson(moduleId, {
        title,
        content,
        videoUrl,
        notesUrl,
        notesLabel,
        order,
      });
      router.push('/admin/lessons');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/lessons" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
        ← Back to lessons
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">New Lesson</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      {courses.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mb-6 text-sm">
          You have no courses yet. <Link href="/admin/courses/new" className="underline font-medium">Create a course first →</Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 mb-1 block">Course</span>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required className="input">
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </label>

        <div className="block">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-700">Module</span>
            {!showNewModule && (
              <button
                type="button"
                onClick={() => setShowNewModule(true)}
                className="text-indigo-600 hover:underline text-xs font-medium"
              >
                + Create new module
              </button>
            )}
          </div>

          {showNewModule ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="Module title (e.g. Introduction)"
                className="input flex-1"
              />
              <button type="button" onClick={handleCreateModule} className="btn-primary text-sm whitespace-nowrap">Add</button>
              <button type="button" onClick={() => setShowNewModule(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          ) : modules.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-sm">
              This course has no modules yet. Click <strong>+ Create new module</strong> above.
            </div>
          ) : (
            <select value={moduleId} onChange={(e) => setModuleId(e.target.value)} required className="input">
              {modules.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          )}
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 mb-1 block">Lesson Title</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="input" placeholder="e.g. Introduction to Quantitative Aptitude" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 mb-1 block">Video URL (optional)</span>
          <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input" placeholder="https://www.youtube.com/watch?v=..." />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 mb-1 block">Content (optional)</span>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="input font-mono text-sm" placeholder="Lesson notes, reading material..." />
        </label>

        <div className="border-t border-gray-100 pt-5">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Downloadable Notes (optional)</h2>

          <label className="block mb-4">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Notes URL</span>
            <input type="text" value={notesUrl} onChange={(e) => setNotesUrl(e.target.value)} className="input" placeholder="https://example.com/notes.pdf or /uploads/file.pdf" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-1 block">Button Label</span>
            <input type="text" value={notesLabel} onChange={(e) => setNotesLabel(e.target.value)} className="input" placeholder="Download Notes (default)" />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 mb-1 block">Order</span>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} min={0} className="input max-w-xs" />
          <span className="text-xs text-slate-500 mt-1 block">Lower numbers appear first.</span>
        </label>

        <button type="submit" disabled={saving || !moduleId} className="btn-primary">
          {saving ? 'Creating...' : 'Create Lesson'}
        </button>
      </form>
    </div>
  );
}