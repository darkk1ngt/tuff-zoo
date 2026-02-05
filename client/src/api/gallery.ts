import type { GalleryImage } from '../types';
import { API_BASE, del, get } from './client';

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const response = await get<{ images: GalleryImage[] }>('/gallery');
  return response.images;
}

export function uploadImage(formData: FormData): Promise<GalleryImage> {
  // Special case: don't set Content-Type header for FormData
  return fetch(`${API_BASE}/admin/gallery`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  }).then((res) => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json().then((data) => data.image as GalleryImage);
  });
}

export function deleteImage(id: number): Promise<void> {
  return del<void>(`/admin/gallery/${id}`);
}
