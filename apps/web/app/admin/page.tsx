'use client';

import { useEffect, useState } from 'react';
import { fetchAdminStats } from '@/lib/api';

type AdminStats = {
  users: number;
  courses: number;
  tests: number;
  questions: number;
  enrollments: number;
  attempts: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!stats) return <p>Loading stats...</p>;

  const cards = [
    { label: 'Users', value: stats.users, color: 'bg-blue-50 border-blue-200' },
    { label: 'Courses', value: stats.courses, color: 'bg-green-50 border-green-200' },
    { label: 'Tests', value: stats.tests, color: 'bg-yellow-50 border-yellow-200' },
    { label: 'Questions', value: stats.questions, color: 'bg-purple-50 border-purple-200' },
    { label: 'Enrollments', value: stats.enrollments, color: 'bg-pink-50 border-pink-200' },
    { label: 'Attempts', value: stats.attempts, color: 'bg-orange-50 border-orange-200' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`border rounded-lg p-6 ${card.color}`}
          >
            <div className="text-sm text-gray-600 mb-1">{card.label}</div>
            <div className="text-4xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


