import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  type JSX,
  useContext,
} from 'solid-js';
import type { RoomType, Ticket } from '../types';
import { calculateNights } from '../utils/formatters';

type CartItem =
  | {
      id: string;
      type: 'ticket';
      ticket: Ticket;
      quantity: number;
    }
  | {
      id: string;
      type: 'hotel';
      hotelId: number;
      hotelName: string;
      roomType: RoomType;
      checkIn: string;
      checkOut: string;
      quantity: number;
    };

interface CartContextValue {
  items: () => CartItem[];
  itemCount: () => number;
  total: () => number;
  addTicket: (ticket: Ticket, quantity?: number) => void;
  setTicketQuantity: (ticketId: number, quantity: number) => void;
  addHotel: (data: {
    hotelId: number;
    hotelName: string;
    roomType: RoomType;
    checkIn: string;
    checkOut: string;
    quantity?: number;
  }) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue>();
const STORAGE_KEY = 'riget_zoo_cart';

export function CartProvider(props: { children: JSX.Element }) {
  const [items, setItems] = createSignal<CartItem[]>([]);

  onMount(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      setItems([]);
    }
  });

  createEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items()));
  });

  const itemCount = createMemo(() =>
    items().reduce((sum, item) => sum + (item.quantity || 1), 0),
  );

  const total = createMemo(() =>
    items().reduce((sum, item) => {
      if (item.type === 'ticket') {
        return sum + item.ticket.price * item.quantity;
      }
      const nights = calculateNights(item.checkIn, item.checkOut);
      return sum + item.roomType.price_per_night * nights * item.quantity;
    }, 0),
  );

  const addTicket = (ticket: Ticket, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.type === 'ticket' && item.ticket.id === ticket.id,
      );
      if (existing && existing.type === 'ticket') {
        return prev.map((item) =>
          item.type === 'ticket' && item.ticket.id === ticket.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...prev,
        { id: `ticket-${ticket.id}`, type: 'ticket', ticket, quantity },
      ];
    });
  };

  const setTicketQuantity = (ticketId: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter(
          (item) => !(item.type === 'ticket' && item.ticket.id === ticketId),
        );
      }
      return prev.map((item) =>
        item.type === 'ticket' && item.ticket.id === ticketId
          ? { ...item, quantity }
          : item,
      );
    });
  };

  const addHotel = (data: {
    hotelId: number;
    hotelName: string;
    roomType: RoomType;
    checkIn: string;
    checkOut: string;
    quantity?: number;
  }) => {
    const id = `hotel-${data.roomType.id}-${data.checkIn}-${data.checkOut}`;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing && existing.type === 'hotel') {
        return prev.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + (data.quantity ?? 1),
              }
            : item,
        );
      }
      return [
        ...prev,
        {
          id,
          type: 'hotel',
          hotelId: data.hotelId,
          hotelName: data.hotelName,
          roomType: data.roomType,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          quantity: data.quantity ?? 1,
        },
      ];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clear = () => setItems([]);

  const value: CartContextValue = {
    items,
    itemCount,
    total,
    addTicket,
    setTicketQuantity,
    addHotel,
    removeItem,
    clear,
  };

  return (
    <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
