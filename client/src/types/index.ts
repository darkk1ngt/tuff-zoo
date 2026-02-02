export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Ticket {
  id: number;
  type: string;
  price: number;
  description: string;
}

export interface Hotel {
  id: number;
  name: string;
  description: string;
  image_url: string;
  room_types: RoomType[];
}

export interface RoomType {
  id: number;
  hotel_id: number;
  name: string;
  description: string;
  price_per_night: number;
  total_rooms: number;
}

export interface Booking {
  id: number;
  user_id: number;
  booking_type: 'ticket' | 'hotel';
  ticket_id?: number;
  room_type_id?: number;
  check_in?: string;
  check_out?: string;
  quantity: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number;
  created_at: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  category?: string;
}

export interface Availability {
  date: string;
  available_rooms: number;
}

export interface ApiError {
  message: string;
  status: number;
}
