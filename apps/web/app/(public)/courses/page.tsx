import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import { fetchCourses } from '@/lib/api';

export default async function CoursesPage() {
  const courses = await fetchCourses();

  return (
    <main className="min-h-screen">
      <PublicNav />
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Courses</h1>
        {courses.length === 0 ? (
          <p className="text-gray-500">No courses available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="block border rounded-lg p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Rs. {course.price}</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {course.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
