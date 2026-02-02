import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      email: string;
      role: 'user' | 'admin';
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: 'user' | 'admin';
      };
    }
  }
}

export {};
