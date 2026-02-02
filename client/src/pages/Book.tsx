import { useNavigate } from "@solidjs/router";
import { createResource, createSignal, For, Show } from "solid-js";
import { createBooking } from "../api/bookings";
import { createCheckoutSession } from "../api/stripe";
import { getTickets } from "../api/tickets";
import { Button } from "../components/common";
import { useAuth } from "../contexts/AuthContext";
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
  const flash = useFlash();

  const [tickets] = createResource(getTickets);
  const [selected, setSelected] = createSignal<SelectedTicket[]>([]);
  const [loading, setLoading] = createSignal(false);

  const getSelectedQuantity = (ticketId: number): number => {
    const item = selected().find((s) => s.ticket.id === ticketId);
    return item?.quantity || 0;
  };

  const updateQuantity = (ticket: Ticket, delta: number) => {
    const current = getSelectedQuantity(ticket.id);
    const newQuantity = Math.max(0, Math.min(10, current + delta));

    if (newQuantity === 0) {
      setSelected((prev) => prev.filter((s) => s.ticket.id !== ticket.id));
    } else {
      setSelected((prev) => {
        const exists = prev.find((s) => s.ticket.id === ticket.id);
        if (exists) {
          return prev.map((s) => (s.ticket.id === ticket.id ? { ...s, quantity: newQuantity } : s));
        }
        return [...prev, { ticket, quantity: newQuantity }];
      });
    }
  };

  const totalPrice = () => {
    return selected().reduce((sum, item) => {
      return sum + item.ticket.price * item.quantity;
    }, 0);
  };

  const handleCheckout = async () => {
    if (!auth.isAuthenticated()) {
      flash.showInfo("Please log in to complete your booking");
      navigate("/login");
      return;
    }

    if (selected().length === 0) {
      flash.showError("Please select at least one ticket");
      return;
    }

    setLoading(true);

    try {
      // Create bookings for each selected ticket
      for (const item of selected()) {
        const booking = await createBooking({
          booking_type: "ticket",
          ticket_id: item.ticket.id,
          quantity: item.quantity,
        });

        // Create Stripe checkout session
        const session = await createCheckoutSession({
          booking_id: booking.id,
          success_url: `${window.location.origin}/checkout/success`,
          cancel_url: `${window.location.origin}/checkout/cancelled`,
        });

        // Redirect to Stripe
        window.location.href = session.url;
        return;
      }
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

      <div class="contentGrid">
        <div>
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

          <section class="section">
            <h2 class="sectionTitle">Looking for accommodation?</h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                "margin-bottom": "var(--space-md)",
              }}
            >
              Extend your stay at one of our on-site hotels for the complete zoo experience.
            </p>
            <Button href="/hotels" variant="secondary">
              View Hotels
            </Button>
          </section>
        </div>

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
          </Show>
        </aside>
      </div>
    </div>
  );
}
