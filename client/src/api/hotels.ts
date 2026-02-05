import type { AvailabilityCheck, Hotel, RoomType } from '../types';
import { get } from './client';

export async function getHotels(): Promise<Hotel[]> {
  const response = await get<{ hotels: Hotel[] }>('/hotels');
  return response.hotels;
}

export async function getHotel(id: number): Promise<Hotel> {
  const response = await get<{ hotel: Hotel }>(`/hotels/${id}`);
  return response.hotel;
}

export async function getRoomTypes(hotelId: number): Promise<RoomType[]> {
  const response = await get<{ room_types: RoomType[] }>(`/hotels/${hotelId}/rooms`);
  return response.room_types;
}

export function checkAvailability(
  hotelId: number,
  roomId: number,
  checkIn: string,
  checkOut: string,
): Promise<AvailabilityCheck> {
  const params = new URLSearchParams({
    checkIn,
    checkOut,
  });
  return get<AvailabilityCheck>(
    `/hotels/${hotelId}/rooms/${roomId}/availability?${params}`,
  ).then((response) => response);
}
