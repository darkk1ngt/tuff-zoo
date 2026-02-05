import { post } from './client';

export interface CheckoutSession {
  url: string;
  session_id: string;
}

export interface CreateCheckoutData {
  booking_id: number;
  success_url: string;
  cancel_url: string;
}

export interface CreateCartCheckoutData {
  booking_ids: number[];
  success_url: string;
  cancel_url: string;
}

export function createCheckoutSession(
  data: CreateCheckoutData,
): Promise<CheckoutSession> {
  return post<CheckoutSession>('/stripe/create-checkout', data);
}

export function createCartCheckoutSession(
  data: CreateCartCheckoutData,
): Promise<CheckoutSession> {
  return post<CheckoutSession>('/stripe/create-checkout-cart', data);
}
