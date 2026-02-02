import { Router, Request, Response } from 'express';
import { UserModel } from '../database/models/User';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const userId = await UserModel.create(email, password, name);
    const user = await UserModel.findById(userId);

    if (user) {
      req.session.user = {
        id: user.id,
        email: user.email,
        role: user.role
      };
    }

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        role: user?.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isValidPassword = await UserModel.verifyPassword(user, password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Logout failed' });
      return;
    }
    res.json({ message: 'Logout successful' });
  });
});

router.get('/me', requireAuth, async (req: Request, res: Response) => {
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
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

export default router;
