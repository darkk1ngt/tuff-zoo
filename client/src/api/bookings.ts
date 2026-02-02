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

export function createBooking(data: CreateBookingData): Promise<Booking> {
  return post<Booking>('/bookings', data);
}

export function getUserBookings(): Promise<Booking[]> {
  return get<Booking[]>('/bookings');
}

export function getBooking(id: number): Promise<Booking> {
  return get<Booking>(`/bookings/${id}`);
}

export function cancelBooking(id: number): Promise<Booking> {
  return put<Booking>(`/bookings/${id}/cancel`);
}

// Admin endpoints
export function getAllBookings(): Promise<Booking[]> {
  return get<Booking[]>('/admin/bookings');
}

export function updateBookingStatus(
  id: number,
  status: Booking['status'],
): Promise<Booking> {
  return put<Booking>(`/admin/bookings/${id}`, { status });
}
