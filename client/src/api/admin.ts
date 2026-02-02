import type { User } from '../types';
import { del, get, put } from './client';

export function getUsers(): Promise<User[]> {
  return get<User[]>('/admin/users');
}

export function updateUser(id: number, data: Partial<User>): Promise<User> {
  return put<User>(`/admin/users/${id}`, data);
}

export function deleteUser(id: number): Promise<void> {
  return del<void>(`/admin/users/${id}`);
}
