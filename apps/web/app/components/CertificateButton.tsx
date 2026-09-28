'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { issueCourseCertificate } from '@/lib/api';

export default function CertificateButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  async function handleClaim() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    setMessage('');
    setError(false);
    try {
      const cert = await issueCourseCertificate(courseId);
      router.push(`/certificates/${cert.id}`);
    } catch (err) {
      setError(true);
      setMessage(err instanceof Error ? err.message : 'Failed');
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClaim}
        disabled={loading}
        className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700 transition disabled:opacity-50"
      >
        {loading ? 'Checking...' : 'Get Certificate'}
      </button>
      {message && (
        <p className={`text-xs mt-2 ${error ? 'text-red-600' : 'text-slate-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}