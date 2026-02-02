import type { Availability, Hotel, RoomType } from '../types';
import { get } from './client';

export function getHotels(): Promise<Hotel[]> {
  return get<Hotel[]>('/hotels');
}

export function getHotel(id: number): Promise<Hotel> {
  return get<Hotel>(`/hotels/${id}`);
}

export function getRoomTypes(hotelId: number): Promise<RoomType[]> {
  return get<RoomType[]>(`/hotels/${hotelId}/rooms`);
}

export function checkAvailability(
  hotelId: number,
  roomId: number,
  checkIn: string,
  checkOut: string,
): Promise<Availability[]> {
  const params = new URLSearchParams({
    check_in: checkIn,
    check_out: checkOut,
  });
  return get<Availability[]>(
    `/hotels/${hotelId}/rooms/${roomId}/availability?${params}`,
  );
}
