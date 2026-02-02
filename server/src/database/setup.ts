import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import bcrypt from 'bcrypt';
import { getPool, query } from './connection';

async function createDatabaseIfNotExists(): Promise<void> {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  const dbName = process.env.DB_NAME || 'riget_zoo';
  await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  console.log(chalk.green(`✓ Database '${dbName}' ready`));
  await connection.end();
}

async function runSqlFile(filePath: string): Promise<void> {
  const sql = fs.readFileSync(filePath, 'utf-8');
  const pool = await getPool();
  await pool.query(sql);
}

async function hasRunOnceMigration(name: string): Promise<boolean> {
  try {
    const results = await query<Array<{ id: number }>>(
      'SELECT id FROM schema_migrations WHERE name = ?',
      [name]
    );
    return results.length > 0;
  } catch {
    return false;
  }
}

async function recordMigration(name: string): Promise<void> {
  await query(
    'INSERT INTO schema_migrations (name, executed_at) VALUES (?, NOW())',
    [name]
  );
}

async function createAdminUser(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@rigetzoo.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await query<Array<{ id: number }>>(
    'SELECT id FROM users WHERE email = ?',
    [adminEmail]
  );

  if (existingAdmin.length === 0) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await query(
      'INSERT INTO users (email, password, name, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      [adminEmail, hashedPassword, 'Admin', 'admin']
    );
    console.log(chalk.green(`✓ Admin user created: ${adminEmail}`));
  } else {
    console.log(chalk.blue(`ℹ Admin user already exists: ${adminEmail}`));
  }
}

export async function initializeDatabase(): Promise<void> {
  console.log(chalk.cyan('\n🔧 Initializing database...\n'));

  await createDatabaseIfNotExists();

  const schemasDir = path.join(__dirname, '..', 'schemas');
  const autorunPath = path.join(schemasDir, 'autorun.sql');
  const runoncePath = path.join(schemasDir, 'runonce.sql');

  if (fs.existsSync(autorunPath)) {
    console.log(chalk.blue('Running autorun.sql...'));
    await runSqlFile(autorunPath);
    console.log(chalk.green('✓ autorun.sql executed'));
  }

  await createAdminUser();

  const runonceName = 'runonce.sql';
  if (fs.existsSync(runoncePath)) {
    const hasRun = await hasRunOnceMigration(runonceName);
    if (!hasRun) {
      console.log(chalk.blue('Running runonce.sql (first time setup)...'));
      await runSqlFile(runoncePath);
      await recordMigration(runonceName);
      console.log(chalk.green('✓ runonce.sql executed'));
    } else {
      console.log(chalk.blue('ℹ runonce.sql already executed, skipping'));
    }
  }

  console.log(chalk.green('\n✓ Database initialization complete\n'));
}
