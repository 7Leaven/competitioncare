import Link from 'next/link';
import PublicNav from './components/PublicNav';
import Footer from './components/Footer';

export default function Home() {
  const features = [
    { href: '/courses', icon: '📚', title: 'Structured Courses', desc: 'Expert-curated courses with video lessons, notes, and practice tests.' },
    { href: '/tests', icon: '📝', title: 'Mock Test Series', desc: 'Full-length tests with real-time scoring and detailed solutions.' },
    { href: '/current-affairs', icon: '📰', title: 'Daily Current Affairs', desc: 'Exam-relevant news, editorials, and monthly compilations.' },
    { href: '/blogs', icon: '✍️', title: 'Expert Blog', desc: 'Strategy guides and preparation tips from toppers.' },
    { href: '/resources', icon: '📄', title: 'Study Resources', desc: 'Previous papers, formula sheets, and revision notes.' },
    { href: '/login', icon: '🎯', title: 'Track Progress', desc: 'Analyze strengths and improve weak areas.' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />

      <section className="bg-gradient-to-br from-indigo-50 via-white to-amber-50">
        <div className="container-page py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge badge-primary mb-6">Trusted by 10,000+ aspirants</span>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Master competitive exams with confidence
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10">
              Comprehensive courses, mock tests, and current affairs for UPSC, SSC, Banking, and State PSC exams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn-primary text-base px-8 py-3">Explore Courses</Link>
              <Link href="/tests" className="btn-secondary text-base px-8 py-3">Try a Free Test</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="container-page py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-1">10K+</div><div className="text-sm text-slate-600">Active Learners</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-1">500+</div><div className="text-sm text-slate-600">Mock Tests</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-1">150+</div><div className="text-sm text-slate-600">Video Lessons</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-1">95%</div><div className="text-sm text-slate-600">Success Rate</div></div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Everything you need to succeed</h2>
            <p className="text-slate-600 text-lg">One platform for courses, tests, notes, and current affairs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Link key={f.href} href={f.href} className="card card-hover p-6 block">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">What our students say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya S.', role: 'UPSC Aspirant', text: 'The mock tests and current affairs updates are top-notch.' },
              { name: 'Rahul K.', role: 'SSC CGL 2025', text: 'The structured courses saved me months of confusion.' },
              { name: 'Anjali M.', role: 'Banking Aspirant', text: 'Best platform for practice. Analytics are incredibly helpful.' },
            ].map((t, i) => (
              <div key={i} className="card p-6">
                <div className="text-amber-500 mb-3">★★★★★</div>
                <p className="text-slate-700 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">{t.name[0]}</div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-10 md:p-14 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start your journey?</h2>
            <p className="text-indigo-100 mb-8 text-lg max-w-2xl mx-auto">Join thousands of aspirants preparing smarter with CompetitionCare.</p>
            <Link href="/login" className="inline-block bg-white text-indigo-700 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition">Get Started — It's Free</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
