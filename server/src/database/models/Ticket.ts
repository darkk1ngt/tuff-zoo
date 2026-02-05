import { query } from '../connection';

export interface Ticket {
  id: number;
  type: string;
  price: number;
  description: string | null;
}

export const TicketModel = {
  async getAll(): Promise<Ticket[]> {
    return query<Ticket[]>('SELECT * FROM tickets ORDER BY price ASC');
  },

  async getById(id: number): Promise<Ticket | null> {
    const results = await query<Ticket[]>(
      'SELECT * FROM tickets WHERE id = ?',
      [id]
    );
    return results[0] || null;
  },

  async updatePrice(id: number, price: number): Promise<void> {
    await query('UPDATE tickets SET price = ? WHERE id = ?', [price, id]);
  },

  async update(id: number, data: Partial<Pick<Ticket, 'price' | 'description'>>): Promise<void> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.price !== undefined) {
      fields.push('price = ?');
      values.push(data.price);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }

    if (fields.length === 0) return;

    values.push(id);
    await query(
      `UPDATE tickets SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  async create(data: Pick<Ticket, 'type' | 'price' | 'description'>): Promise<number> {
    const result = await query<{ insertId: number }>(
      'INSERT INTO tickets (type, price, description) VALUES (?, ?, ?)',
      [data.type, data.price, data.description || null]
    );
    return (result as unknown as { insertId: number }).insertId;
  },

  async delete(id: number): Promise<void> {
    await query('DELETE FROM tickets WHERE id = ?', [id]);
  }
};
