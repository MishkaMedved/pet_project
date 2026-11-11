export type PublicationCategory = 'ARTICLE' | 'INTERVIEW' | 'REPORT' | 'SMM_CASE' | 'OTHER';
export type ExperienceType = 'WORK' | 'EDUCATION';
export type MediaType = 'PHOTO' | 'VIDEO' | 'DOCUMENT';

export interface SocialLink {
  name: string;
  url: string;
}

export interface Profile {
  fullName: string;
  headline: string | null;
  bio: string | null;
  photoUrl: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  resumeFileUrl: string | null;
  socialLinks: SocialLink[];
}

export interface Publication {
  id?: number;
  title: string;
  category: PublicationCategory;
  outlet: string | null;
  summary: string | null;
  content: string | null;
  coverUrl: string | null;
  externalUrl: string | null;
  publishedAt: string | null;
}

export interface Experience {
  id?: number;
  type: ExperienceType;
  organization: string;
  position: string | null;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  sortOrder: number;
}

export interface Skill {
  id?: number;
  name: string;
  category: string | null;
  sortOrder: number;
}

export interface MediaItem {
  id?: number;
  type: MediaType;
  title: string | null;
  description: string | null;
  url: string;
}

export const CATEGORY_LABELS: Record<PublicationCategory, string> = {
  ARTICLE: 'Статья',
  INTERVIEW: 'Интервью',
  REPORT: 'Репортаж',
  SMM_CASE: 'SMM-кейс',
  OTHER: 'Другое',
};

export const EXPERIENCE_LABELS: Record<ExperienceType, string> = {
  WORK: 'Работа',
  EDUCATION: 'Образование',
};

export const MEDIA_LABELS: Record<MediaType, string> = {
  PHOTO: 'Фото',
  VIDEO: 'Видео',
  DOCUMENT: 'Документ',
};

const TOKEN_KEY = 'admin-token';

export const auth = {
  token(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage unavailable */
    }
  },
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  const token = auth.token();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const res = await fetch(url, { method, headers, body: payload });
  if (res.status === 401 && url.startsWith('/api/admin')) {
    auth.clear();
    window.location.assign('/admin/login');
  }
  if (!res.ok) {
    let message = `Ошибка ${res.status}`;
    try {
      const data = await res.json();
      if (data?.detail) message = data.detail;
      else if (data?.message) message = data.message;
    } catch {
      /* not JSON */
    }
    throw new ApiError(res.status, message);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  get: <T>(url: string) => request<T>('GET', url),
  post: <T>(url: string, body: unknown) => request<T>('POST', url, body),
  put: <T>(url: string, body: unknown) => request<T>('PUT', url, body),
  delete: (url: string) => request<void>('DELETE', url),

  login: (username: string, password: string) =>
    request<{ token: string }>('POST', '/api/auth/login', { username, password }),

  upload(file: File): Promise<{ url: string }> {
    const form = new FormData();
    form.append('file', file);
    return request('POST', '/api/admin/files', form);
  },
};

export function formatDate(date: string | null, withDay = true): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('ru-RU', withDay
    ? { day: 'numeric', month: 'long', year: 'numeric' }
    : { month: 'long', year: 'numeric' });
}

export function youtubeEmbed(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
