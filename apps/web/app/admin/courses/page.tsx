'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCourses, deleteCourse } from '@/lib/api';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteCourse(id);
      load();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Link
          href="/admin/courses/new"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-500">No courses yet.</p>
      ) : (
        <table className="w-full border rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.title}</td>
                <td className="p-3 text-gray-500">{c.slug}</td>
                <td className="p-3">Rs. {c.price}</td>
                <td className="p-3">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {c.status}
                  </span>
                </td>
                <td className="p-3">
                  <Link
                    href={`/admin/courses/${c.id}`}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(c.id, c.title)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


