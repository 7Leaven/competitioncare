'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchCourse, updateCourse } from '@/lib/api';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState('DRAFT');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourse(id)
      .then((data) => {
        if (!data) return;
        setTitle(data.title);
        setSlug(data.slug);
        setDescription(data.description);
        setPrice(Number(data.price));
        setStatus(data.status);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateCourse(id, { title, slug, description, price, status });
      router.push('/admin/courses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Link
        href="/admin/courses"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        Back to courses
      </Link>
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <label className="block">
          <span className="text-sm font-medium">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Slug</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Price (Rs.)</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={0}
            required
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
