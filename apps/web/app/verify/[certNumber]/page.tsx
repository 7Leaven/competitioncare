'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { verifyCertificate } from '@/lib/api';

export default function VerifyCertificatePage() {
  const params = useParams();
  const certNumber = params.certNumber as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyCertificate(certNumber)
      .then(setData)
      .finally(() => setLoading(false));
  }, [certNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNav />
        <div className="container-page py-12 flex-1 text-center text-slate-500">Verifying...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1 max-w-2xl">
        {!data ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid Certificate</h1>
            <p className="text-slate-600 mb-2">No certificate found with number:</p>
            <div className="font-mono text-sm text-slate-800 mb-6">{certNumber}</div>
            <Link href="/" className="btn-primary inline-block">Go Home</Link>
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-emerald-600 mb-2">Certificate Verified</h1>
            <p className="text-slate-600 mb-8">This certificate is authentic and was issued by CompetitionCare.</p>

            <div className="bg-slate-50 rounded-lg p-6 text-left space-y-4">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Awarded To</div>
                <div className="text-lg font-semibold text-slate-900">{data.user?.fullName}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Certificate</div>
                <div className="font-medium text-slate-900">{data.certificate.title}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Issued On</div>
                <div className="font-medium text-slate-900">
                  {new Date(data.certificate.issuedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Certificate Number</div>
                <div className="font-mono text-sm text-slate-800">{data.certificate.certNumber}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}