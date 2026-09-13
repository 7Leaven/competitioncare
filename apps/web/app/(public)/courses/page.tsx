import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchCourses } from '@/lib/api';

export default async function CoursesPage() {
  const courses = await fetchCourses();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Explore Courses</h1>
          <p className="text-slate-600 text-lg">Structured learning paths crafted by experts.</p>
        </div>

        {courses.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-slate-600">No courses available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <Link key={course.id} href={`/courses/${course.id}`} className="card card-hover overflow-hidden block">
                <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-5xl font-bold opacity-30">{course.title[0]}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge ${course.status === 'PUBLISHED' ? 'badge-success' : 'badge-warning'}`}>{course.status}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-xl font-bold text-indigo-600">₹{course.price}</span>
                    <span className="text-sm text-indigo-600 font-medium">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
