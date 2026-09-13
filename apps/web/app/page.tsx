import Link from 'next/link';
import PublicNav from './components/PublicNav';

export default function Home() {
  return (
    <main className="min-h-screen">
      <PublicNav />

      <div className="max-w-6xl mx-auto p-8">
        <p className="text-gray-600 mb-8 text-lg">
          Your trusted platform for competitive exam preparation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/courses"
            className="block border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Courses</h2>
            <p className="text-gray-600 text-sm">
              Explore our structured learning programs.
            </p>
          </Link>

          <Link
            href="/tests"
            className="block border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Test Series</h2>
            <p className="text-gray-600 text-sm">
              Practice with mock tests and see your score.
            </p>
          </Link>

          <Link
            href="/current-affairs"
            className="block border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Current Affairs</h2>
            <p className="text-gray-600 text-sm">
              Daily news and updates for exams.
            </p>
          </Link>

          <Link
            href="/blogs"
            className="block border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Blog</h2>
            <p className="text-gray-600 text-sm">
              Tips and strategies for exam success.
            </p>
          </Link>

          <Link
            href="/resources"
            className="block border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Resources</h2>
            <p className="text-gray-600 text-sm">
              Download notes, papers, and study material.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
