import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import chalk from 'chalk';

import { createConnection, initializeDatabase } from './database';

import authRoutes from './routes/auth';
import passwordRoutes from './routes/password';
import ticketRoutes from './routes/tickets';
import bookingRoutes from './routes/booking';
import stripeRoutes from './routes/stripe';
import adminRoutes from './routes/admin';
import filesRoutes from './routes/files';
import userRoutes from './routes/user';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api', bookingRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', filesRoutes);
app.use('/api/user', userRoutes);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(chalk.red('Error:'), err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

async function startServer() {
  try {
    console.log(chalk.cyan('\n🦁 Starting Riget Zoo Adventures Server...\n'));

    await createConnection();
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(chalk.green(`\n🚀 Server running on http://localhost:${PORT}`));
      console.log(chalk.blue(`📚 API endpoints available at http://localhost:${PORT}/api\n`));
    });
  } catch (error) {
    console.error(chalk.red('Failed to start server:'), error);
    process.exit(1);
  }
}

startServer();
