import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { UserModel } from '../database/models/User';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/reset', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.json({ message: 'If the email exists, a reset token has been generated' });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await UserModel.setResetToken(email, token, expires);

    res.json({
      message: 'Password reset token generated',
      token,
      expires: expires.toISOString()
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

router.post('/reset/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ error: 'New password is required' });
      return;
    }

    const user = await UserModel.findByResetToken(token);
    if (!user) {
      res.status(400).json({ error: 'Invalid or expired reset token' });
      return;
    }

    await UserModel.updatePassword(user.id, password);
    await UserModel.clearResetToken(user.id);

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

router.put('/change', requireAuth, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required' });
      return;
    }

    const user = await UserModel.findByEmail(req.user!.email);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isValidPassword = await UserModel.verifyPassword(user, currentPassword);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }

    await UserModel.updatePassword(user.id, newPassword);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

export default router;
