import { query } from '../connection';

export interface RoomType {
  id: number;
  hotel_id: number;
  name: string;
  description: string | null;
  price_per_night: number;
  total_rooms: number;
}

export const RoomTypeModel = {
  async getByHotel(hotelId: number): Promise<RoomType[]> {
    return query<RoomType[]>(
      'SELECT * FROM room_types WHERE hotel_id = ? ORDER BY price_per_night ASC',
      [hotelId]
    );
  },

  async getById(id: number): Promise<RoomType | null> {
    const results = await query<RoomType[]>(
      'SELECT * FROM room_types WHERE id = ?',
      [id]
    );
    return results[0] || null;
  },

  async checkAvailability(roomTypeId: number, checkIn: string, checkOut: string): Promise<number> {
    const roomType = await this.getById(roomTypeId);
    if (!roomType) return 0;

    const bookedRooms = await query<Array<{ booked_count: number }>>(
      `SELECT COUNT(*) as booked_count FROM bookings
       WHERE room_type_id = ?
       AND status IN ('pending', 'confirmed')
       AND check_in < ?
       AND check_out > ?`,
      [roomTypeId, checkOut, checkIn]
    );

    const bookedCount = bookedRooms[0]?.booked_count || 0;
    return Math.max(0, roomType.total_rooms - bookedCount);
  },

  async updateRoomType(id: number, data: Partial<Pick<RoomType, 'name' | 'description' | 'price_per_night' | 'total_rooms'>>): Promise<void> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }
    if (data.price_per_night !== undefined) {
      fields.push('price_per_night = ?');
      values.push(data.price_per_night);
    }
    if (data.total_rooms !== undefined) {
      fields.push('total_rooms = ?');
      values.push(data.total_rooms);
    }

    if (fields.length === 0) return;

    values.push(id);
    await query(
      `UPDATE room_types SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }
};
