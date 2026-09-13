import Link from 'next/link';
import { fetchCourse } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await fetchCourse(id);
  if (!course) return notFound();

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <Link
        href="/courses"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        Back to courses
      </Link>

      <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-600 mb-6">{course.description}</p>

      <div className="border rounded-lg p-6 flex justify-between items-center">
        <span className="text-3xl font-bold">Rs. {course.price}</span>
        <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
          Enroll Now
        </button>
      </div>
    </main>
  );
}

