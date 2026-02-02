import type { GalleryImage } from '../types';
import { del, get } from './client';

export function getGalleryImages(): Promise<GalleryImage[]> {
  return get<GalleryImage[]>('/gallery');
}

export function uploadImage(formData: FormData): Promise<GalleryImage> {
  // Special case: don't set Content-Type header for FormData
  return fetch('http://localhost:3001/api/admin/gallery', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  }).then((res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  });
}

export function deleteImage(id: number): Promise<void> {
  return del<void>(`/admin/gallery/${id}`);
}
