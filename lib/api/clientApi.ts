import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';

export interface RegisterDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  avatar?: string;
}

export const register = async (dto: RegisterDto): Promise<User> => {
  const response = await api.post<User>('/auth/register', dto);
  return response.data;
};

export const login = async (dto: LoginDto): Promise<User> => {
  const response = await api.post<User>('/auth/login', dto);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  const response = await api.get<User | null>('/auth/session');
  return response.data || null;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const updateMe = async (dto: UpdateUserDto): Promise<User> => {
  const response = await api.patch<User>('/users/me', dto);
  return response.data;
};

export const fetchNotes = async (params?: {
  search?: string;
  page?: number;
  tag?: string;
}): Promise<Note[]> => {
  const response = await api.get<Note[]>('/notes', {
    params: { ...params, perPage: 12 },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (dto: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  const response = await api.post<Note>('/notes', dto);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};
