import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchResources } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default async function ResourcesPage() {
  const { items } = await fetchResources({ take: 50 });

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Resources</h1>
          <p className="text-slate-600 text-lg">Download notes, papers, and study material.</p>
        </div>

        {items.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📄</div>
            <p className="text-slate-600">No resources yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item: any) => {
              const fullUrl = API_URL + item.fileUrl;
              return (
                <div key={item.id} className="card card-hover p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-2xl flex-shrink-0">📄</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <span className="badge badge-primary">{item.category}</span>
                        <span className="text-xs text-slate-500">{item.downloadCount} downloads</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                      {item.description && <p className="text-sm text-slate-600 mb-3">{item.description}</p>}
                      <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block text-sm">Download</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
