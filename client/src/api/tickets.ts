import type { Ticket } from '../types';
import { del, get, post, put } from './client';

export function getTickets(): Promise<Ticket[]> {
  return get<Ticket[]>('/tickets');
}

export function getTicket(id: number): Promise<Ticket> {
  return get<Ticket>(`/tickets/${id}`);
}

export function createTicket(ticket: Omit<Ticket, 'id'>): Promise<Ticket> {
  return post<Ticket>('/admin/tickets', ticket);
}

export function updateTicket(
  id: number,
  ticket: Partial<Ticket>,
): Promise<Ticket> {
  return put<Ticket>(`/admin/tickets/${id}`, ticket);
}

export function deleteTicket(id: number): Promise<void> {
  return del<void>(`/admin/tickets/${id}`);
}
