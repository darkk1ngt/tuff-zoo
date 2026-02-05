import { useNavigate } from '@solidjs/router';
import { createMemo, createSignal, For, Show } from 'solid-js';
import { createBooking } from '../api/bookings';
import { createCartCheckoutSession } from '../api/stripe';
import { Button } from '../components/common';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFlash } from '../contexts/FlashContext';
import { calculateNights, formatPrice } from '../utils/formatters';

export default function Cart() {
  const auth = useAuth();
  const cart = useCart();
  const flash = useFlash();
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(false);

  const cartItems = createMemo(() => cart.items());

  const handleCheckout = async () => {
    if (!auth.isAuthenticated()) {
      flash.showInfo('Please log in to complete your booking');
      navigate('/login');
      return;
    }

    if (cartItems().length === 0) {
      flash.showError('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const bookingIds: number[] = [];

      for (const item of cartItems()) {
        if (item.type === 'ticket') {
          const booking = await createBooking({
            booking_type: 'ticket',
            ticket_id: item.ticket.id,
            quantity: item.quantity,
          });
          bookingIds.push(booking.id);
        } else {
          const booking = await createBooking({
            booking_type: 'hotel',
            room_type_id: item.roomType.id,
            check_in: item.checkIn,
            check_out: item.checkOut,
            quantity: item.quantity,
          });
          bookingIds.push(booking.id);
        }
      }

      const session = await createCartCheckoutSession({
        booking_ids: bookingIds,
        success_url: `${window.location.origin}/checkout/success`,
        cancel_url: `${window.location.origin}/checkout/cancelled`,
      });

      cart.clear();
      window.location.href = session.url;
    } catch {
      flash.showError('Failed to create checkout session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="page">
      <div class="header">
        <h1 class="title">Your Cart</h1>
        <p class="subtitle">Review your selections before heading to checkout.</p>
      </div>

      <Show
        when={cartItems().length}
        fallback={
          <div class="emptyState">
            <p>Your cart is empty.</p>
            <Button href="/book" variant="primary" style={{ 'margin-top': '1rem' }}>
              Book Tickets
            </Button>
          </div>
        }
      >
        <div class="cartGrid">
          <div class="cartList">
            <For each={cartItems()}>
              {(item) => (
                <div class="cartItem">
                  <div class="cartItemInfo">
                    <h3 class="cartItemTitle">
                      {item.type === 'ticket' ? item.ticket.type : item.roomType.name}
                    </h3>
                    <p class="cartItemSubtitle">
                      {item.type === 'ticket'
                        ? item.ticket.description
                        : `${item.hotelName} · ${item.checkIn} to ${item.checkOut}`}
                    </p>
                    <Show when={item.type === 'hotel'}>
                      <span class="cartItemMeta">
                        {calculateNights(item.checkIn, item.checkOut)} night
                        {calculateNights(item.checkIn, item.checkOut) > 1 ? 's' : ''}
                      </span>
                    </Show>
                  </div>

                  <div class="cartItemActions">
                    <Show
                      when={item.type === 'ticket'}
                      fallback={<span class="cartItemQuantity">x{item.quantity}</span>}
                    >
                      <div class="quantityControls">
                        <button
                          class="quantityButton"
                          onClick={() =>
                            cart.setTicketQuantity(item.ticket.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span class="quantityValue">{item.quantity}</span>
                        <button
                          class="quantityButton"
                          onClick={() =>
                            cart.setTicketQuantity(item.ticket.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </Show>
                    <span class="cartItemPrice">
                      {item.type === 'ticket'
                        ? formatPrice(item.ticket.price * item.quantity)
                        : formatPrice(
                            item.roomType.price_per_night *
                              calculateNights(item.checkIn, item.checkOut) *
                              item.quantity,
                          )}
                    </span>
                    <button
                      class="linkButton"
                      onClick={() => cart.removeItem(item.id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>

          <aside class="summary">
            <h3 class="summaryTitle">Order Summary</h3>
            <div class="summaryItem">
              <span>Items</span>
              <span>{cart.itemCount()}</span>
            </div>
            <div class="summaryTotal">
              <span class="summaryTotalLabel">Total</span>
              <span class="summaryTotalPrice">{formatPrice(cart.total())}</span>
            </div>
            <div class="checkoutButton">
              <Button variant="primary" fullWidth loading={loading()} onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </aside>
        </div>
      </Show>
    </div>
  );
}
