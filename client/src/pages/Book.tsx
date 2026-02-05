import { useNavigate } from "@solidjs/router";
import { createMemo, createResource, createSignal, For, Show } from "solid-js";
import { createBooking } from "../api/bookings";
import { createCartCheckoutSession } from "../api/stripe";
import { getTickets } from "../api/tickets";
import { Button } from "../components/common";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useFlash } from "../contexts/FlashContext";
import type { Ticket } from "../types";
import { formatPrice } from "../utils/formatters";

interface SelectedTicket {
  ticket: Ticket;
  quantity: number;
}

export default function Book() {
  const navigate = useNavigate();
  const auth = useAuth();
  const cart = useCart();
  const flash = useFlash();

  const [tickets] = createResource(getTickets);
  const [loading, setLoading] = createSignal(false);

  const selected = createMemo<SelectedTicket[]>(() =>
    cart
      .items()
      .filter((item) => item.type === "ticket")
      .map((item) => ({
        ticket: item.ticket,
        quantity: item.quantity,
      })),
  );

  const getSelectedQuantity = (ticketId: number): number => {
    const item = selected().find((s) => s.ticket.id === ticketId);
    return item?.quantity || 0;
  };

  const updateQuantity = (ticket: Ticket, delta: number) => {
    const current = getSelectedQuantity(ticket.id);
    const newQuantity = Math.max(0, Math.min(10, current + delta));
    if (current === 0 && newQuantity > 0) {
      cart.addTicket(ticket, newQuantity);
      return;
    }
    cart.setTicketQuantity(ticket.id, newQuantity);
  };

  const totalPrice = createMemo(() =>
    selected().reduce((sum, item) => sum + item.ticket.price * item.quantity, 0),
  );

  const handleCheckout = async () => {
    if (!auth.isAuthenticated()) {
      flash.showInfo("Please log in to complete your booking");
      navigate("/login");
      return;
    }

    if (cart.items().length === 0) {
      flash.showError("Please add at least one item to your cart");
      return;
    }

    setLoading(true);

    try {
      const bookingIds: number[] = [];
      for (const item of cart.items()) {
        if (item.type === "ticket") {
          const booking = await createBooking({
            booking_type: "ticket",
            ticket_id: item.ticket.id,
            quantity: item.quantity,
          });
          bookingIds.push(booking.id);
        } else {
          const booking = await createBooking({
            booking_type: "hotel",
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
    } catch (_error) {
      flash.showError("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="page">
      <div class="header">
        <h1 class="title">Book Your Visit</h1>
        <p class="subtitle">
          Choose your tickets and join us for an unforgettable wildlife experience
        </p>
      </div>

      <div class="bookGrid">
        <section class="section">
          <h2 class="sectionTitle">Ticket Options</h2>

          <Show
            when={!tickets.loading}
            fallback={<div class="emptyState">Loading tickets...</div>}
          >
            <div class="ticketsGrid">
              <For each={tickets()}>
                {(ticket) => (
                  <div
                    class={`ticketCard ${getSelectedQuantity(ticket.id) > 0 ? "selected" : ""}`}
                  >
                    <h3 class="ticketType">{ticket.type}</h3>
                    <p class="ticketDescription">{ticket.description}</p>
                    <div class="ticketPrice">
                      {formatPrice(ticket.price)}
                      <span class="ticketPriceLabel"> / person</span>
                    </div>

                    <div class="quantitySelector">
                      <span class="quantityLabel">Quantity:</span>
                      <div class="quantityControls">
                        <button
                          class="quantityButton"
                          onClick={() => updateQuantity(ticket, -1)}
                          disabled={getSelectedQuantity(ticket.id) === 0}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span class="quantityValue">{getSelectedQuantity(ticket.id)}</span>
                        <button
                          class="quantityButton"
                          onClick={() => updateQuantity(ticket, 1)}
                          disabled={getSelectedQuantity(ticket.id) >= 10}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </section>

        <aside class="summary">
          <h3 class="summaryTitle">Order Summary</h3>

          <Show
            when={selected().length > 0}
            fallback={<p class="emptyState">Select tickets to see your order summary</p>}
          >
            <For each={selected()}>
              {(item) => (
                <div class="summaryItem">
                  <span class="summaryItemName">
                    {item.ticket.type} x{item.quantity}
                  </span>
                  <span class="summaryItemPrice">
                    {formatPrice(item.ticket.price * item.quantity)}
                  </span>
                </div>
              )}
            </For>

            <div class="summaryTotal">
              <span class="summaryTotalLabel">Total</span>
              <span class="summaryTotalPrice">{formatPrice(totalPrice())}</span>
            </div>

            <div class="checkoutButton">
              <Button variant="primary" fullWidth loading={loading()} onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
            <div class="viewCartLink">
              <Button href="/cart" variant="outline" fullWidth>
                View Full Cart
              </Button>
            </div>
          </Show>
        </aside>
      </div>
    </div>
  );
}
