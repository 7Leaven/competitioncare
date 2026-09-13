import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">C</div>
              <span className="text-lg font-bold text-white">CompetitionCare</span>
            </div>
            <p className="text-sm text-slate-400">Your trusted platform for competitive exam preparation.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Learn</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="hover:text-white transition">Courses</Link></li>
              <li><Link href="/tests" className="hover:text-white transition">Test Series</Link></li>
              <li><Link href="/resources" className="hover:text-white transition">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Stay Updated</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/current-affairs" className="hover:text-white transition">Current Affairs</Link></li>
              <li><Link href="/blogs" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} CompetitionCare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
