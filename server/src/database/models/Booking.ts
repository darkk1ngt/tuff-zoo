import { query } from '../connection';

export interface Booking {
  id: number;
  user_id: number;
  booking_type: 'ticket' | 'hotel';
  check_in: Date | null;
  check_out: Date | null;
  room_type_id: number | null;
  ticket_id: number | null;
  quantity: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number;
  stripe_session_id: string | null;
  created_at: Date;
}

export interface BookingWithDetails extends Booking {
  user_email?: string;
  user_name?: string;
  ticket_type?: string;
  hotel_name?: string;
  room_type_name?: string;
}

export interface CreateBookingData {
  user_id: number;
  booking_type: 'ticket' | 'hotel';
  check_in?: string;
  check_out?: string;
  room_type_id?: number;
  ticket_id?: number;
  quantity?: number;
  total_price: number;
  stripe_session_id?: string;
}

export const BookingModel = {
  async create(data: CreateBookingData): Promise<number> {
    const result = await query<{ insertId: number }>(
      `INSERT INTO bookings
       (user_id, booking_type, check_in, check_out, room_type_id, ticket_id, quantity, status, total_price, stripe_session_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, NOW())`,
      [
        data.user_id,
        data.booking_type,
        data.check_in || null,
        data.check_out || null,
        data.room_type_id || null,
        data.ticket_id || null,
        data.quantity || 1,
        data.total_price,
        data.stripe_session_id || null
      ]
    );
    return (result as unknown as { insertId: number }).insertId;
  },

  async getByUser(userId: number): Promise<BookingWithDetails[]> {
    return query<BookingWithDetails[]>(
      `SELECT b.*,
              t.type as ticket_type,
              h.name as hotel_name,
              rt.name as room_type_name
       FROM bookings b
       LEFT JOIN tickets t ON b.ticket_id = t.id
       LEFT JOIN room_types rt ON b.room_type_id = rt.id
       LEFT JOIN hotels h ON rt.hotel_id = h.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [userId]
    );
  },

  async getById(id: number): Promise<BookingWithDetails | null> {
    const results = await query<BookingWithDetails[]>(
      `SELECT b.*,
              u.email as user_email,
              u.name as user_name,
              t.type as ticket_type,
              h.name as hotel_name,
              rt.name as room_type_name
       FROM bookings b
       LEFT JOIN users u ON b.user_id = u.id
       LEFT JOIN tickets t ON b.ticket_id = t.id
       LEFT JOIN room_types rt ON b.room_type_id = rt.id
       LEFT JOIN hotels h ON rt.hotel_id = h.id
       WHERE b.id = ?`,
      [id]
    );
    return results[0] || null;
  },

  async getAll(): Promise<BookingWithDetails[]> {
    return query<BookingWithDetails[]>(
      `SELECT b.*,
              u.email as user_email,
              u.name as user_name,
              t.type as ticket_type,
              h.name as hotel_name,
              rt.name as room_type_name
       FROM bookings b
       LEFT JOIN users u ON b.user_id = u.id
       LEFT JOIN tickets t ON b.ticket_id = t.id
       LEFT JOIN room_types rt ON b.room_type_id = rt.id
       LEFT JOIN hotels h ON rt.hotel_id = h.id
       ORDER BY b.created_at DESC`
    );
  },

  async updateStatus(id: number, status: Booking['status']): Promise<void> {
    await query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
  },

  async delete(id: number): Promise<void> {
    await query('DELETE FROM bookings WHERE id = ?', [id]);
  },

  async getByStripeSessionId(sessionId: string): Promise<Booking | null> {
    const results = await query<Booking[]>(
      'SELECT * FROM bookings WHERE stripe_session_id = ?',
      [sessionId]
    );
    return results[0] || null;
  },

  async updateStripeSessionId(id: number, sessionId: string): Promise<void> {
    await query(
      'UPDATE bookings SET stripe_session_id = ? WHERE id = ?',
      [sessionId, id]
    );
  }
};
