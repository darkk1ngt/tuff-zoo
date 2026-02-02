import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { GalleryImageModel } from '../database/models/GalleryImage';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  if (allowedMimeTypes.includes(mimeType) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

router.get('/gallery', async (_req: Request, res: Response) => {
  try {
    const images = await GalleryImageModel.getAll();
    res.json({ images });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ error: 'Failed to get gallery images' });
  }
});

router.post('/admin/gallery', requireAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded' });
      return;
    }

    const imageId = await GalleryImageModel.create(req.file.filename, req.user!.id);

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: {
        id: imageId,
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload image error:', error);
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

router.delete('/admin/gallery/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid image ID' });
      return;
    }

    const image = await GalleryImageModel.getById(id);
    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    const filePath = path.join(uploadsDir, image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await GalleryImageModel.delete(id);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
