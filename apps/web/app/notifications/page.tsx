'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '@/lib/api';

type Notification = {
  id: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await fetchNotifications();
    setItems(data.items);
    setUnread(data.unreadCount);
    setLoading(false);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    void load();
  }, []);

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    await load();
  }

  async function handleMarkAll() {
    await markAllNotificationsRead();
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this notification?')) return;
    await deleteNotification(id);
    await load();
  }

  if (loading) return <div className="p-12 text-center text-slate-500">Loading notifications...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Notifications</h1>
            <p className="text-slate-600">
              {unread > 0 ? `${unread} unread` : 'All caught up'}
            </p>
          </div>
          {unread > 0 && (
            <button onClick={handleMarkAll} className="btn-secondary text-sm">
              Mark all as read
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">🔔</div>
            <p className="text-slate-600">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((n) => (
              <div
                key={n.id}
                className={`card p-5 ${
                  n.read ? '' : 'border-l-4 border-l-indigo-600 bg-indigo-50/30'
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />
                    )}
                    <span className="font-semibold text-slate-900">{n.title}</span>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-3 ml-4">{n.message}</p>
                <div className="flex gap-3 ml-4 text-sm">
                  {n.link && (
                    <Link href={n.link} className="text-indigo-600 hover:underline">Open</Link>
                  )}
                  {!n.read && (
                    <button onClick={() => handleMarkRead(n.id)} className="text-slate-600 hover:underline">Mark as read</button>
                  )}
                  <button onClick={() => handleDelete(n.id)} className="text-red-600 hover:underline">Delete</button>
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