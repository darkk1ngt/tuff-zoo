import { Router, Request, Response } from 'express';
import { UserModel } from '../database/models/User';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/profile', async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

router.put('/profile', async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      res.status(400).json({ error: 'At least one field (name or email) is required' });
      return;
    }

    if (email) {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser && existingUser.id !== req.user!.id) {
        res.status(409).json({ error: 'Email already in use' });
        return;
      }
    }

    await UserModel.update(req.user!.id, { name, email });

    const updatedUser = await UserModel.findById(req.user!.id);

    if (updatedUser && email) {
      req.session.user = {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role
      };
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser?.id,
        email: updatedUser?.email,
        name: updatedUser?.name,
        role: updatedUser?.role,
        created_at: updatedUser?.created_at
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
