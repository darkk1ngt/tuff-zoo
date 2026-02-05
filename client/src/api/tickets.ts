import type { Ticket } from '../types';
import { del, get, post, put } from './client';

export async function getTickets(): Promise<Ticket[]> {
  const response = await get<{ tickets: Ticket[] }>('/tickets');
  return response.tickets;
}

export async function getTicket(id: number): Promise<Ticket> {
  const response = await get<{ ticket: Ticket }>(`/tickets/${id}`);
  return response.ticket;
}

export async function createTicket(ticket: Omit<Ticket, 'id'>): Promise<Ticket> {
  const response = await post<{ ticket: Ticket }>('/admin/tickets', ticket);
  return response.ticket;
}

export function updateTicket(
  id: number,
  ticket: Partial<Ticket>,
): Promise<Ticket> {
  return put<{ ticket: Ticket }>(`/admin/tickets/${id}`, ticket).then(
    (response) => response.ticket,
  );
}

export function deleteTicket(id: number): Promise<void> {
  return del<void>(`/admin/tickets/${id}`);
}
