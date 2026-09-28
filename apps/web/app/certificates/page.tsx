'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchMyCertificates } from '@/lib/api';

type Certificate = {
  id: string;
  title: string;
  certNumber: string;
  issuedAt: string;
  courseId: string | null;
  testId: string | null;
};

export default function CertificatesPage() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchMyCertificates()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNav />
        <div className="container-page py-12 flex-1 text-center text-slate-500">Loading certificates...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1 max-w-4xl">
        <div className="mb-8">
          <Link href="/dashboard" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
            ← Back to dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Certificates</h1>
          <p className="text-slate-600">Your earned certificates of completion and achievement.</p>
        </div>

        {items.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-xl font-bold mb-2">No certificates yet</h2>
            <p className="text-slate-600 mb-6">Complete a course or take a test to earn your first certificate.</p>
            <Link href="/courses" className="btn-primary inline-block">Browse Courses</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((c) => (
              <div key={c.id} className="card p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl flex-shrink-0">
                      🏆
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 mb-1">{c.title}</h3>
                      <div className="text-xs text-slate-500">
                        Issued {new Date(c.issuedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-1">{c.certNumber}</div>
                    </div>
                  </div>
                  <Link href={`/certificates/${c.id}`} className="btn-primary text-sm whitespace-nowrap">
                    View Certificate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}