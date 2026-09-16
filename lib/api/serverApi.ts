import { api } from './api';
import { cookies } from 'next/headers';
import { Note } from '@/types/note';
import { User } from '@/types/user';

export async function getAuthHeaders() {
  const cookieStore = await cookies();
  return {
    Cookie: cookieStore.toString(),
  };
}

export async function checkSession() {
  const headers = await getAuthHeaders();
  return await api.get('/auth/session', { headers });
}

export async function fetchNoteById(id: string): Promise<Note> {
  const headers = await getAuthHeaders();
  const response = await api.get<Note>(`/notes/${id}`, { headers });
  return response.data;
}

export async function getMe(): Promise<User> {
  const headers = await getAuthHeaders();
  const response = await api.get<User>('/users/me', { headers });
  return response.data;
}

export async function fetchNotes(params?: Record<string, unknown>) {
  const headers = await getAuthHeaders();
  const response = await api.get('/notes', { headers, params });
  return response.data;
}
