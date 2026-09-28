const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export async function fetchCourses() {
  const res = await fetch(`${API_URL}/api/courses`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
}

export async function fetchCourse(id: string) {
  const res = await fetch(`${API_URL}/api/courses/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCourseModules(courseId: string) {
  const res = await fetch(`${API_URL}/api/courses/${courseId}/modules`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchTests() {
  const res = await fetch(`${API_URL}/api/tests`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch tests');
  return res.json();
}

export async function fetchTest(id: string) {
  const res = await fetch(`${API_URL}/api/tests/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function fetchMe() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchAdminStats() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function enroll(courseId: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/enrollments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ courseId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Enrollment failed');
  }
  return res.json();
}

export async function fetchMyEnrollments() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/enrollments/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export async function checkEnrollment(courseId: string) {
  const token = getToken();
  if (!token) return { enrolled: false };
  const res = await fetch(`${API_URL}/api/enrollments/check/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return { enrolled: false };
  return res.json();
}

export async function startAttempt(testId: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/tests/${testId}/attempts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to start attempt');
  return res.json();
}

export async function submitAttempt(
  attemptId: string,
  answers: { questionId: string; selectedOption: number }[],
) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/attempts/${attemptId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) throw new Error('Failed to submit attempt');
  return res.json();
}

export async function fetchMyAttempts() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/attempts/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAttempt(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/attempts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function createCourse(data: {
  title: string;
  slug: string;
  description: string;
  price: number;
  status?: string;
}) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Create failed');
  }
  return res.json();
}

export async function updateCourse(id: string, data: any) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/courses/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Update failed');
  }
  return res.json();
}

export async function deleteCourse(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/courses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Delete failed');
  }
  return res.json();
}

export async function createTest(data: {
  title: string;
  description?: string;
  duration: number;
}) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/tests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Create failed');
  }
  return res.json();
}

export async function deleteTest(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/tests/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}

export async function createQuestion(
  testId: string,
  data: {
    text: string;
    options: string[];
    correctOption: number;
    explanation?: string;
    marks?: number;
    order?: number;
  },
) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/tests/${testId}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Create failed');
  }
  return res.json();
}

export async function deleteQuestion(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/questions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}

export async function fetchCurrentAffairs(params?: {
  category?: string;
  skip?: number;
  take?: number;
}) {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.skip) query.set('skip', String(params.skip));
  if (params?.take) query.set('take', String(params.take));
  const qs = query.toString();
  const res = await fetch(
    `${API_URL}/api/current-affairs${qs ? '?' + qs : ''}`,
    { cache: 'no-store' },
  );
  if (!res.ok) throw new Error('Failed to fetch current affairs');
  return res.json();
}

export async function fetchCurrentAffair(slug: string) {
  const res = await fetch(`${API_URL}/api/current-affairs/${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function createCurrentAffair(data: {
  title: string;
  slug: string;
  summary?: string;
  content: string;
  category?: string;
  tags?: string[];
}) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/current-affairs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Create failed');
  }
  return res.json();
}

export async function fetchCurrentAffairById(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/current-affairs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function updateCurrentAffair(id: string, data: any) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/current-affairs/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Update failed');
  }
  return res.json();
}

export async function deleteCurrentAffair(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/current-affairs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}


export async function fetchBlogs(params?: {
  category?: string;
  skip?: number;
  take?: number;
}) {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.skip) query.set('skip', String(params.skip));
  if (params?.take) query.set('take', String(params.take));
  const qs = query.toString();
  const url = qs ? API_URL + '/api/blogs?' + qs : API_URL + '/api/blogs';
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
}

export async function fetchBlog(slug: string) {
  const res = await fetch(`${API_URL}/api/blogs/${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchBlogById(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/blogs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function createBlog(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  tags?: string[];
}) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Create failed');
  }
  return res.json();
}

export async function updateBlog(id: string, data: any) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/blogs/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Update failed');
  }
  return res.json();
}

export async function deleteBlog(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/blogs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}

export async function fetchResources(params?: {
  category?: string;
  skip?: number;
  take?: number;
}) {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.skip) query.set('skip', String(params.skip));
  if (params?.take) query.set('take', String(params.take));
  const qs = query.toString();
  const url = qs ? API_URL + '/api/resources?' + qs : API_URL + '/api/resources';
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
}

export async function fetchResource(slug: string) {
  const res = await fetch(`${API_URL}/api/resources/${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchResourceById(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/resources/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function uploadResourceFile(file: File) {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/api/resources/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Upload failed');
  }
  return res.json();
}

export async function createResource(data: {
  title: string;
  slug: string;
  description?: string;
  category?: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
}) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Create failed');
  }
  return res.json();
}

export async function updateResource(id: string, data: any) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/resources/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Update failed');
  }
  return res.json();
}

export async function deleteResource(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/resources/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}

export async function fetchLesson(id: string) {
  const res = await fetch(`${API_URL}/api/lessons/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function markLessonComplete(lessonId: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/lessons/${lessonId}/complete`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to mark complete');
  return res.json();
}

export async function fetchCourseProgress(courseId: string) {
  const token = getToken();
  if (!token) return { completedLessonIds: [], totalLessons: 0, completedCount: 0, percent: 0 };
  const res = await fetch(`${API_URL}/api/courses/${courseId}/progress`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return { completedLessonIds: [], totalLessons: 0, completedCount: 0, percent: 0 };
  return res.json();
}

export async function fetchProfile() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_URL}/api/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function updateProfile(data: {
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
}) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/auth/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Update failed');
  }
  return res.json();
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Password change failed');
  }
  return res.json();
}

export async function fetchNotifications() {
  const token = getToken();
  if (!token) return { items: [], unreadCount: 0 };
  const res = await fetch(`${API_URL}/api/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return { items: [], unreadCount: 0 };
  return res.json();
}

export async function fetchUnreadCount() {
  const token = getToken();
  if (!token) return { unreadCount: 0 };
  const res = await fetch(`${API_URL}/api/notifications/unread-count`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return { unreadCount: 0 };
  return res.json();
}

export async function markNotificationRead(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/notifications/${id}/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function markAllNotificationsRead() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/notifications/read-all`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function deleteNotification(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/notifications/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function search(q: string) {
  if (!q || q.trim().length < 2) {
    return { courses: [], tests: [], currentAffairs: [], blogs: [], resources: [], total: 0 };
  }
  const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(q)}`, {
    cache: 'no-store',
  });
  if (!res.ok) return { courses: [], tests: [], currentAffairs: [], blogs: [], resources: [], total: 0 };
  return res.json();
}

export async function updateLesson(id: string, data: {
  title?: string;
  content?: string;
  videoUrl?: string;
  notesUrl?: string;
  notesLabel?: string;
  order?: number;
}) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/lessons/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Update failed');
  }
  return res.json();
}

export async function createModule(courseId: string, title: string, order = 0) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/courses/${courseId}/modules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, order }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Create failed');
  }
  return res.json();
}

export async function createLesson(
  moduleId: string,
  data: {
    title: string;
    content?: string;
    videoUrl?: string;
    notesUrl?: string;
    notesLabel?: string;
    order?: number;
  },
) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/modules/${moduleId}/lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Create failed');
  }
  return res.json();
}

export async function fetchBookmarks() {
  const token = getToken();
  if (!token) return { items: [], total: 0 };
  const res = await fetch(`${API_URL}/api/bookmarks`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return { items: [], total: 0 };
  return res.json();
}

export async function checkBookmark(itemType: string, itemId: string) {
  const token = getToken();
  if (!token) return { bookmarked: false };
  const res = await fetch(
    `${API_URL}/api/bookmarks/check?itemType=${itemType}&itemId=${itemId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  );
  if (!res.ok) return { bookmarked: false };
  return res.json();
}

export async function addBookmark(itemType: string, itemId: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ itemType, itemId }),
  });
  if (!res.ok) throw new Error('Failed to bookmark');
  return res.json();
}

export async function removeBookmark(itemType: string, itemId: string) {
  const token = getToken();
  const res = await fetch(
    `${API_URL}/api/bookmarks?itemType=${itemType}&itemId=${itemId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!res.ok) throw new Error('Failed to remove bookmark');
  return res.json();
}

export async function fetchMyAnalytics() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_URL}/api/analytics/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchMyCertificates() {
  const token = getToken();
  if (!token) return [];
  const res = await fetch(`${API_URL}/api/certificates`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchCertificate(id: string) {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_URL}/api/certificates/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function verifyCertificate(certNumber: string) {
  const res = await fetch(`${API_URL}/api/certificates/verify/${certNumber}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function issueCourseCertificate(courseId: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/certificates/course/${courseId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to issue certificate');
  }
  return res.json();
}

export async function issueTestCertificate(testId: string, attemptId: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/certificates/test/${testId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ attemptId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to issue certificate');
  }
  return res.json();
}

export async function fetchProgressDashboard() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`\/api/progress-dashboard/me`, {
    headers: { Authorization: `Bearer \eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NDZkNWQyZi03ZGYwLTQ2NjAtYmY1Mi1jNzE2NDFmMmZmNGYiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODk2NjAzOTQsImV4cCI6MTc5MDI2NTE5NH0.UuhlC8O5GnuQGVfQRH75xsYE0aBIU4LFNdZVq_Z9mKs` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function createDoubt(subject: string, question: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/doubts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subject, question }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to submit doubt');
  }
  return res.json();
}

export async function fetchMyDoubts() {
  const token = getToken();
  if (!token) return [];
  const res = await fetch(`${API_URL}/api/doubts/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAllDoubts() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/doubts`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export async function answerDoubt(id: string, answer: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/doubts/${id}/answer`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answer }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to submit answer');
  }
  return res.json();
}

export async function deleteDoubt(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/doubts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}

export async function subscribeNewsletter(email: string, name?: string) {
  const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, source: 'website' }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Subscription failed');
  }
  return res.json();
}

export async function fetchNewsletterSubscribers() {
  const token = getToken();
  if (!token) return [];
  const res = await fetch(`${API_URL}/api/newsletter`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchNewsletterCount() {
  const token = getToken();
  if (!token) return { total: 0, active: 0 };
  const res = await fetch(`${API_URL}/api/newsletter/count`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return { total: 0, active: 0 };
  return res.json();
}

export async function deleteNewsletterSubscriber(id: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/newsletter/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}