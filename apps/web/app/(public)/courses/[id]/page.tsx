import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchCourse, fetchCourseModules } from '@/lib/api';
import { notFound } from 'next/navigation';
import EnrollButton from '@/app/components/EnrollButton';
import BookmarkButton from '@/app/components/BookmarkButton';
import CertificateButton from '@/app/components/CertificateButton';

export default async function CourseDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await fetchCourse(id);
  if (!course) return notFound();
  const modules = await fetchCourseModules(id);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />

      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
        <div className="container-page py-16">
          <Link href="/courses" className="text-indigo-200 hover:text-white text-sm mb-4 inline-block">
            ← Back to courses
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
          <p className="text-indigo-100 text-lg max-w-3xl">{course.description}</p>
        </div>
      </section>

      <div className="container-page py-12 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Curriculum</h2>
          {modules.length === 0 ? (
            <div className="card p-8 text-center text-slate-600">No modules yet.</div>
          ) : (
            <div className="space-y-4">
              {modules.map((mod: any, idx: number) => (
                <div key={mod.id} className="card p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {idx + 1}
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900">{mod.title}</h3>
                  </div>
                  <ul className="space-y-2 ml-11">
                    {mod.lessons.map((lesson: any) => (
                      <li key={lesson.id}>
                        <Link
                          href={`/courses/${id}/lessons/${lesson.id}`}
                          className="flex items-center gap-2 text-slate-700 text-sm hover:text-indigo-600 transition group"
                        >
                          <span className="text-indigo-500 group-hover:translate-x-0.5 transition">▸</span>
                          <span>{lesson.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <div className="text-4xl font-bold text-indigo-600 mb-2">₹{course.price}</div>
            <p className="text-slate-500 text-sm mb-6">Full lifetime access</p>
            <EnrollButton courseId={course.id} alreadyEnrolled={false} />
            <div className="mt-4">
              <BookmarkButton itemType="COURSE" itemId={course.id} />
            </div>
            <div className="mt-3">
              <CertificateButton courseId={course.id} />
            </div>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">✓ Video lessons</li>
              <li className="flex items-center gap-2">✓ Downloadable notes</li>
              <li className="flex items-center gap-2">✓ Certificate of completion</li>
              <li className="flex items-center gap-2">✓ Lifetime access</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}