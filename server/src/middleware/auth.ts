import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  req.user = req.session.user;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  if (req.session.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  req.user = req.session.user;
  next();
}
