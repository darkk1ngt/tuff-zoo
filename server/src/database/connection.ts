import mysql from 'mysql2/promise';
import chalk from 'chalk';

let pool: mysql.Pool | null = null;

export async function createConnection(): Promise<mysql.Pool> {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'riget_zoo',
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
  });

  console.log(chalk.green('✓ Database connection pool created'));
  return pool;
}

export async function getPool(): Promise<mysql.Pool> {
  if (!pool) {
    return createConnection();
  }
  return pool;
}

export async function query<T>(sql: string, params?: unknown[]): Promise<T> {
  const connection = await getPool();
  const [results] = await connection.execute(sql, params);
  return results as T;
}

export async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log(chalk.yellow('Database connection pool closed'));
  }
}
