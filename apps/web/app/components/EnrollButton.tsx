'use client';

import { useState } from 'react';
import { enroll } from '@/lib/api';

export default function EnrollButton({
  courseId,
  alreadyEnrolled,
}: {
  courseId: string;
  alreadyEnrolled: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(alreadyEnrolled);
  const [message, setMessage] = useState('');

  async function handleEnroll() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      await enroll(courseId);
      setEnrolled(true);
      setMessage('Enrolled successfully!');
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (enrolled) {
    return (
      <div className="text-green-600 font-semibold">
        Enrolled {message && <span className="text-sm ml-2">{message}</span>}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Enrolling...' : 'Enroll Now'}
      </button>
      {message && <p className="text-red-600 text-sm mt-2">{message}</p>}
    </div>
  );
}


