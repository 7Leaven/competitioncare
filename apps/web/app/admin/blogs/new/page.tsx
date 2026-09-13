'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBlog } from '@/lib/api';

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function autoSlug(value: string) {
    setTitle(value);
    if (!slug) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      await createBlog({
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
      });
      router.push('/admin/blogs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
      setSaving(false);
    }
  }

  return (
    <div>
      <Link
        href="/admin/blogs"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        Back to blog posts
      </Link>
      <h1 className="text-3xl font-bold mb-6">New Blog Post</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <label className="block">
          <span className="text-sm font-medium">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => autoSlug(e.target.value)}
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
          <span className="text-sm font-medium">Excerpt (short)</span>
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
          {saving ? 'Saving...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}
