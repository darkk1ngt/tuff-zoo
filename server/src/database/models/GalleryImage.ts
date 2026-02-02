import { query } from '../connection';

export interface GalleryImage {
  id: number;
  filename: string;
  uploaded_by: number;
  created_at: Date;
}

export interface GalleryImageWithUploader extends GalleryImage {
  uploader_name?: string;
  uploader_email?: string;
}

export const GalleryImageModel = {
  async create(filename: string, uploadedBy: number): Promise<number> {
    const result = await query<{ insertId: number }>(
      'INSERT INTO gallery_images (filename, uploaded_by, created_at) VALUES (?, ?, NOW())',
      [filename, uploadedBy]
    );
    return (result as unknown as { insertId: number }).insertId;
  },

  async getAll(): Promise<GalleryImageWithUploader[]> {
    return query<GalleryImageWithUploader[]>(
      `SELECT gi.*, u.name as uploader_name, u.email as uploader_email
       FROM gallery_images gi
       LEFT JOIN users u ON gi.uploaded_by = u.id
       ORDER BY gi.created_at DESC`
    );
  },

  async getById(id: number): Promise<GalleryImage | null> {
    const results = await query<GalleryImage[]>(
      'SELECT * FROM gallery_images WHERE id = ?',
      [id]
    );
    return results[0] || null;
  },

  async delete(id: number): Promise<void> {
    await query('DELETE FROM gallery_images WHERE id = ?', [id]);
  }
};
