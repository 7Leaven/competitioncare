'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchCertificate } from '@/lib/api';

export default function CertificateDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificate(id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading...</div>;
  if (!data) return <div className="p-12 text-center text-slate-500">Certificate not found.</div>;

  const { certificate, user } = data;

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <Link href="/certificates" className="text-indigo-600 hover:underline text-sm">
          ← Back to certificates
        </Link>
        <button
          onClick={() => window.print()}
          className="btn-primary text-sm"
        >
          Print / Save as PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-indigo-700 font-bold text-xl">C</div>
            <span className="text-2xl font-bold">CompetitionCare</span>
          </div>
          <p className="text-indigo-200 text-sm">Excellence in Competitive Exam Preparation</p>
        </div>

        <div className="p-12 text-center border-b-4 border-amber-500">
          <div className="text-6xl mb-6">🏆</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Certificate of Completion</h1>
          <p className="text-lg text-slate-600 mb-8">This certificate is proudly presented to</p>

          <div className="text-3xl font-bold text-indigo-700 mb-2">{user?.fullName || 'Student'}</div>
          <div className="text-sm text-slate-500 mb-8">{user?.email}</div>

          <div className="h-px bg-slate-200 max-w-md mx-auto mb-8"></div>

          <p className="text-lg text-slate-700 mb-6">for successfully completing</p>
          <h2 className="text-2xl font-semibold text-slate-900 mb-12">{certificate.title}</h2>

          <div className="flex justify-between items-end mt-16 pt-8 border-t border-slate-200">
            <div className="text-left">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Issued On</div>
              <div className="font-medium text-slate-800">
                {new Date(certificate.issuedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl mx-auto mb-2">
                ✓
              </div>
              <div className="text-xs text-slate-500">Verified</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Certificate No.</div>
              <div className="font-mono font-medium text-slate-800">{certificate.certNumber}</div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 text-center text-xs text-slate-500">
          Verify this certificate at <span className="font-mono">/verify/{certificate.certNumber}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6 text-center">
        <Link
          href={`/verify/${certificate.certNumber}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          Share verification link →
        </Link>
      </div>
    </div>
  );
}