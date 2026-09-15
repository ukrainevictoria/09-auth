import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';
import { cookies } from 'next/headers';

const getAuthHeaders = () => {
  const cookieStore = cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const fetchNotes = async (params?: {
  search?: string;
  page?: number;
  tag?: string;
}): Promise<Note[]> => {
  const response = await api.get<Note[]>('/notes', {
    ...getAuthHeaders(),
    params: { ...params, perPage: 12 },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`, getAuthHeaders());
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me', getAuthHeaders());
  return response.data;
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const response = await api.get<User | null>(
      '/auth/session',
      getAuthHeaders(),
    );
    return response.data || null;
  } catch {
    return null;
  }
};
