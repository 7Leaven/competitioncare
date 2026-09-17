'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/app/components/PublicNav';
import Footer from '@/app/components/Footer';
import { fetchProfile, updateProfile, changePassword } from '@/lib/api';

export default function ProfilePage() {
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchProfile()
      .then((data) => {
        if (!data) return;
        setFullName(data.fullName || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatarUrl || '');
        setEmail(data.email);
        setRole(data.role);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateProfile({ fullName, bio, avatarUrl });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('Password must be at least 6 characters');
      return;
    }
    setPwSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPwSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Change failed');
    } finally {
      setPwSaving(false);
    }
  }

  if (loading) return <div className="p-12 text-center text-slate-500">Loading profile...</div>;

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="container-page py-12 flex-1 max-w-4xl">
        <div className="mb-10">
          <Link href="/dashboard" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
            ← Back to dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
          <p className="text-slate-600">Manage your account settings and preferences.</p>
        </div>

        <div className="card p-8 mb-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-slate-900 mb-1">{fullName || 'Unnamed'}</div>
              <div className="text-slate-600 mb-2">{email}</div>
              <span className="badge badge-primary">{role}</span>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg mb-4 text-sm">{success}</div>}

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">Edit Profile</h2>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Full Name</span>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="input" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Bio</span>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="input" placeholder="Tell us about yourself..." />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Avatar URL</span>
              <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="input" placeholder="https://example.com/avatar.jpg" />
            </label>

            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="card p-8">
          {pwError && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">{pwError}</div>}
          {pwSuccess && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg mb-4 text-sm">{pwSuccess}</div>}

          <form onSubmit={handleChangePassword} className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Current Password</span>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="input" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">New Password</span>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} className="input" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Confirm New Password</span>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input" />
            </label>

            <button type="submit" disabled={pwSaving} className="btn-primary">
              {pwSaving ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}