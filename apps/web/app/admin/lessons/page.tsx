'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCourses, fetchCourseModules } from '@/lib/api';

type LessonRow = {
  id: string;
  title: string;
  hasVideo: boolean;
  hasNotes: boolean;
  courseId: string;
  courseTitle: string;
  moduleTitle: string;
};

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const courses = await fetchCourses();
        const all: LessonRow[] = [];
        for (const c of courses) {
          const modules = await fetchCourseModules(c.id);
          for (const m of modules) {
            for (const l of m.lessons || []) {
              all.push({
                id: l.id,
                title: l.title,
                hasVideo: !!l.videoUrl,
                hasNotes: !!l.notesUrl,
                courseId: c.id,
                courseTitle: c.title,
                moduleTitle: m.title,
              });
            }
          }
        }
        setLessons(all);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const filtered = lessons.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      l.moduleTitle.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <p>Loading lessons...</p>;

  return (
    <div>
           <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">All Lessons</h1>
          <p className="text-slate-600 mt-1">{lessons.length} lessons across all courses</p>
        </div>
        <Link
          href="/admin/lessons/new"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm font-medium"
        >
          + New Lesson
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search lessons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input mb-6 max-w-md"
      />

      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">
          {lessons.length === 0 ? 'No lessons yet. Add modules and lessons to a course first.' : 'No lessons match your search.'}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Lesson</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Module</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Course</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Content</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 font-medium text-slate-900">{l.title}</td>
                  <td className="p-3 text-slate-600 text-sm">{l.moduleTitle}</td>
                  <td className="p-3 text-slate-600 text-sm">{l.courseTitle}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <span className={`badge ${l.hasVideo ? 'badge-success' : 'badge-warning'}`}>
                        {l.hasVideo ? 'Video' : 'No Video'}
                      </span>
                      <span className={`badge ${l.hasNotes ? 'badge-success' : 'badge-warning'}`}>
                        {l.hasNotes ? 'Notes' : 'No Notes'}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/admin/lessons/${l.id}`}
                      className="text-indigo-600 hover:underline text-sm font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}