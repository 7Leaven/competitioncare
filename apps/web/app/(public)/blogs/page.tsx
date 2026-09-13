import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchBlogs } from '@/lib/api';

export default async function BlogsPage() {
  const { items } = await fetchBlogs({ take: 50 });

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Blog</h1>
          <p className="text-slate-600 text-lg">Strategy guides and tips for competitive exams.</p>
        </div>

        {items.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">✍️</div>
            <p className="text-slate-600">No posts yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any) => (
              <Link key={item.id} href={`/blogs/${item.slug}`} className="card card-hover overflow-hidden block">
                <div className="h-40 bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                  <span className="text-white text-5xl font-bold opacity-30">{item.title[0]}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-success">{item.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">{item.title}</h3>
                  {item.excerpt && <p className="text-slate-600 text-sm line-clamp-2 mb-4">{item.excerpt}</p>}
                  <div className="text-xs text-slate-500 pt-4 border-t border-gray-100">
                    {new Date(item.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
