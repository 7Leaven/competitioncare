import Link from 'next/link';
import { fetchCourse, fetchCourseModules } from '@/lib/api';
import { notFound } from 'next/navigation';
import EnrollButton from '@/app/components/EnrollButton';

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await fetchCourse(id);
  if (!course) return notFound();

  const modules = await fetchCourseModules(id);

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

      <div className="border rounded-lg p-6 flex justify-between items-center mb-8">
        <span className="text-3xl font-bold">Rs. {course.price}</span>
        <EnrollButton courseId={course.id} alreadyEnrolled={false} />
      </div>

      <h2 className="text-2xl font-bold mb-4">Curriculum</h2>
      {modules.length === 0 ? (
        <p className="text-gray-500">No modules yet.</p>
      ) : (
        <div className="space-y-4">
          {modules.map((mod: any, idx: number) => (
            <div key={mod.id} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">
                Module {idx + 1}: {mod.title}
              </h3>
              <ul className="space-y-1 ml-4">
                {mod.lessons.map((lesson: any, li: number) => (
                  <li key={lesson.id} className="text-gray-700">
                    {li + 1}. {lesson.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}


