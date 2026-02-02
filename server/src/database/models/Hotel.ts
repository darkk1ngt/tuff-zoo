import { query } from '../connection';
import { RoomType } from './RoomType';

export interface Hotel {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
}

export interface HotelWithRooms extends Hotel {
  room_types: RoomType[];
}

export const HotelModel = {
  async getAll(): Promise<Hotel[]> {
    return query<Hotel[]>('SELECT * FROM hotels ORDER BY name ASC');
  },

  async getById(id: number): Promise<Hotel | null> {
    const results = await query<Hotel[]>(
      'SELECT * FROM hotels WHERE id = ?',
      [id]
    );
    return results[0] || null;
  },

  async getAllWithRoomTypes(): Promise<HotelWithRooms[]> {
    const hotels = await query<Hotel[]>('SELECT * FROM hotels ORDER BY name ASC');
    const roomTypes = await query<(RoomType & { hotel_id: number })[]>(
      'SELECT * FROM room_types ORDER BY price_per_night ASC'
    );

    return hotels.map(hotel => ({
      ...hotel,
      room_types: roomTypes.filter(rt => rt.hotel_id === hotel.id)
    }));
  },

  async getByIdWithRoomTypes(id: number): Promise<HotelWithRooms | null> {
    const hotel = await this.getById(id);
    if (!hotel) return null;

    const roomTypes = await query<RoomType[]>(
      'SELECT * FROM room_types WHERE hotel_id = ? ORDER BY price_per_night ASC',
      [id]
    );

    return {
      ...hotel,
      room_types: roomTypes
    };
  }
};
