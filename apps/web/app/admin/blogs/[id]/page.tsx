'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchBlogById, updateBlog } from '@/lib/api';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogById(id)
      .then((data) => {
        if (!data) return;
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt || '');
        setContent(data.content);
        setCategory(data.category);
        setTagsInput((data.tags || []).join(', '));
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      await updateBlog(id, {
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
      });
      router.push('/admin/blogs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Link
        href="/admin/blogs"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        Back to blog posts
      </Link>
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
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
          <span className="text-sm font-medium">Category</span>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Excerpt</span>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={14}
            className="w-full border rounded px-3 py-2 mt-1 font-mono text-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Tags (comma-separated)</span>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
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
