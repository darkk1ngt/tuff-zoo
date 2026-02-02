import { query } from '../connection';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  reset_token: string | null;
  reset_token_expires: Date | null;
  created_at: Date;
}

export type UserWithoutPassword = Omit<User, 'password'>;

export const UserModel = {
  async findByEmail(email: string): Promise<User | null> {
    const results = await query<User[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return results[0] || null;
  },

  async findById(id: number): Promise<UserWithoutPassword | null> {
    const results = await query<UserWithoutPassword[]>(
      'SELECT id, email, name, role, reset_token, reset_token_expires, created_at FROM users WHERE id = ?',
      [id]
    );
    return results[0] || null;
  },

  async create(email: string, password: string, name: string): Promise<number> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query<{ insertId: number }>(
      'INSERT INTO users (email, password, name, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      [email, hashedPassword, name, 'user']
    );
    return (result as unknown as { insertId: number }).insertId;
  },

  async update(id: number, data: Partial<Pick<User, 'name' | 'email' | 'role'>>): Promise<void> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.name) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.email) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (data.role) {
      fields.push('role = ?');
      values.push(data.role);
    }

    if (fields.length === 0) return;

    values.push(id);
    await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async delete(id: number): Promise<void> {
    await query('DELETE FROM users WHERE id = ?', [id]);
  },

  async getAll(): Promise<UserWithoutPassword[]> {
    return query<UserWithoutPassword[]>(
      'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
    );
  },

  async updatePassword(id: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  },

  async setResetToken(email: string, token: string, expires: Date): Promise<boolean> {
    const result = await query<{ affectedRows: number }>(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [token, expires, email]
    );
    return (result as unknown as { affectedRows: number }).affectedRows > 0;
  },

  async findByResetToken(token: string): Promise<User | null> {
    const results = await query<User[]>(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );
    return results[0] || null;
  },

  async clearResetToken(id: number): Promise<void> {
    await query(
      'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [id]
    );
  },

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
};
