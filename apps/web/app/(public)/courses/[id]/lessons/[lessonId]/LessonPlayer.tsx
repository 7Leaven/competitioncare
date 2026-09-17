'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchLesson, markLessonComplete, fetchCourseProgress } from '@/lib/api';

type LessonData = {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  order: number;
  module: {
    id: string;
    title: string;
    course: { id: string; title: string };
    lessons: { id: string; title: string; order: number }[];
  };
};

export default function LessonPlayer({
  courseId,
  lessonId,
}: {
  courseId: string;
  lessonId: string;
}) {
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [progress, setProgress] = useState<{
    completedLessonIds: string[];
    totalLessons: number;
    completedCount: number;
    percent: number;
  }>({ completedLessonIds: [], totalLessons: 0, completedCount: 0, percent: 0 });
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  async function load() {
    const data = await fetchLesson(lessonId);
    setLesson(data);
    const p = await fetchCourseProgress(courseId);
    setProgress(p);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [lessonId, courseId]);

  async function handleMarkComplete() {
    setMarking(true);
    try {
      await markLessonComplete(lessonId);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setMarking(false);
    }
  }

  if (loading) return <div className="p-12 text-center text-slate-500">Loading lesson...</div>;
  if (!lesson) return <div className="p-12 text-center text-slate-500">Lesson not found.</div>;

  const allLessons = lesson.module.lessons;
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const isCompleted = progress.completedLessonIds.includes(lesson.id);

  function getEmbedUrl(url: string) {
    if (url.includes('youtube.com/watch')) {
      const v = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${v}`;
    }
    if (url.includes('youtu.be/')) {
      const v = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${v}`;
    }
    if (url.includes('vimeo.com/')) {
      const v = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${v}`;
    }
    return url;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container-page py-3 flex justify-between items-center">
          <Link href={`/courses/${courseId}`} className="text-sm text-indigo-600 hover:underline">
            ← Back to course
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <div className="text-xs text-slate-500 mb-1">{progress.completedCount} of {progress.totalLessons} complete</div>
              <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress.percent}%` }} />
              </div>
            </div>
            <span className="badge badge-primary">{progress.percent}%</span>
          </div>
        </div>
      </header>

      <div className="container-page py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {lesson.videoUrl ? (
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
              <iframe
                src={getEmbedUrl(lesson.videoUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center mb-6">
              <div className="text-center text-white">
                <div className="text-6xl mb-2">📖</div>
                <div className="text-sm text-indigo-100">Reading material</div>
              </div>
            </div>
          )}

          <div className="card p-6 mb-6">
            <div className="text-xs text-indigo-600 font-medium mb-1">{lesson.module.title}</div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{lesson.title}</h1>

            {lesson.content && (
              <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed mb-6">
                {lesson.content}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              {isCompleted ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                  ✓ Completed
                </div>
              ) : (
                <button
                  onClick={handleMarkComplete}
                  disabled={marking}
                  className="btn-primary"
                >
                  {marking ? 'Marking...' : 'Mark as Complete'}
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-3">
            {prevLesson ? (
              <Link
                href={`/courses/${courseId}/lessons/${prevLesson.id}`}
                className="btn-secondary text-sm"
              >
                ← Previous
              </Link>
            ) : <div />}
            {nextLesson ? (
              <Link
                href={`/courses/${courseId}/lessons/${nextLesson.id}`}
                className="btn-primary text-sm"
              >
                Next →
              </Link>
            ) : (
              <Link href={`/courses/${courseId}`} className="btn-primary text-sm">
                Finish Course
              </Link>
            )}
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="card p-4 sticky top-20">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Course Content</h3>
            <div className="space-y-1">
              {allLessons.map((l, i) => {
                const done = progress.completedLessonIds.includes(l.id);
                const active = l.id === lesson.id;
                return (
                  <Link
                    key={l.id}
                    href={`/courses/${courseId}/lessons/${l.id}`}
                    className={`flex items-center gap-2 p-2 rounded text-sm transition ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {done ? '✓' : i + 1}
                    </span>
                    <span className="line-clamp-2">{l.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
