import type { Booking } from '../types';
import { get, post, put } from './client';

export interface CreateTicketBooking {
  booking_type: 'ticket';
  ticket_id: number;
  quantity: number;
}

export interface CreateHotelBooking {
  booking_type: 'hotel';
  room_type_id: number;
  check_in: string;
  check_out: string;
  quantity: number;
}

export type CreateBookingData = CreateTicketBooking | CreateHotelBooking;

export async function createBooking(data: CreateBookingData): Promise<Booking> {
  const response = await post<{ booking: Booking }>('/bookings', data);
  return response.booking;
}

export async function getUserBookings(): Promise<Booking[]> {
  const response = await get<{ bookings: Booking[] }>('/bookings');
  return response.bookings;
}

export async function getBooking(id: number): Promise<Booking> {
  const response = await get<{ booking: Booking }>(`/bookings/${id}`);
  return response.booking;
}

export async function cancelBooking(id: number): Promise<Booking> {
  const response = await put<{ booking: Booking }>(`/bookings/${id}/cancel`);
  return response.booking;
}

// Admin endpoints
export async function getAllBookings(): Promise<Booking[]> {
  const response = await get<{ bookings: Booking[] }>('/admin/bookings');
  return response.bookings;
}

export function updateBookingStatus(
  id: number,
  status: Booking['status'],
): Promise<Booking> {
  return put<{ booking: Booking }>(`/admin/bookings/${id}`, { status }).then(
    (response) => response.booking,
  );
}
