import { A, useNavigate, useParams } from "@solidjs/router";
import { createMemo, createResource, createSignal, For, Show } from "solid-js";
import { createBooking } from "../api/bookings";
import { getHotel } from "../api/hotels";
import { createCheckoutSession } from "../api/stripe";
import { Button, Input } from "../components/common";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useFlash } from "../contexts/FlashContext";
import type { RoomType } from "../types";
import { calculateNights, formatPrice } from "../utils/formatters";
import { validateDateRange } from "../utils/validators";

export default function HotelDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const cart = useCart();
  const flash = useFlash();

  const [hotel] = createResource(() => getHotel(Number(params.id)));
  const [selectedRoom, setSelectedRoom] = createSignal<RoomType | null>(null);
  const [checkIn, setCheckIn] = createSignal("");
  const [checkOut, setCheckOut] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const today = new Date().toISOString().split("T")[0];

  const nights = createMemo(() => {
    if (!checkIn() || !checkOut()) return 0;
    return calculateNights(checkIn(), checkOut());
  });

  const totalPrice = createMemo(() => {
    const room = selectedRoom();
    if (!room || nights() <= 0) return 0;
    return room.price_per_night * nights();
  });

  const canBook = createMemo(() => {
    const dateValidation = validateDateRange(checkIn(), checkOut());
    return selectedRoom() && dateValidation.valid;
  });

  const handleBook = async () => {
    if (!auth.isAuthenticated()) {
      flash.showInfo("Please log in to complete your booking");
      navigate("/login");
      return;
    }

    const room = selectedRoom();
    if (!room) {
      flash.showError("Please select a room");
      return;
    }

    const dateValidation = validateDateRange(checkIn(), checkOut());
    if (!dateValidation.valid) {
      flash.showError(dateValidation.message!);
      return;
    }

    setLoading(true);

    try {
      const booking = await createBooking({
        booking_type: "hotel",
        room_type_id: room.id,
        check_in: checkIn(),
        check_out: checkOut(),
        quantity: 1,
      });

      const session = await createCheckoutSession({
        booking_id: booking.id,
        success_url: `${window.location.origin}/checkout/success`,
        cancel_url: `${window.location.origin}/checkout/cancelled`,
      });

      window.location.href = session.url;
    } catch (_error) {
      flash.showError("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const room = selectedRoom();
    if (!room) {
      flash.showError("Please select a room");
      return;
    }

    const dateValidation = validateDateRange(checkIn(), checkOut());
    if (!dateValidation.valid) {
      flash.showError(dateValidation.message!);
      return;
    }

    const hotelData = hotel();
    if (!hotelData) return;

    cart.addHotel({
      hotelId: hotelData.id,
      hotelName: hotelData.name,
      roomType: room,
      checkIn: checkIn(),
      checkOut: checkOut(),
      quantity: 1,
    });

    flash.showSuccess("Added to cart");
    navigate("/cart");
  };

  return (
    <div class="page">
      <A href="/hotels" class="backLink">
        <svg
          class="backIcon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Hotels
      </A>

      <Show
        when={!hotel.loading && hotel()}
        fallback={<div class="emptyState">Loading hotel details...</div>}
      >
        <div class="hero">
          <img
            src={
              hotel()?.image_url ||
              "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80"
            }
            alt={hotel()?.name}
            class="heroImage"
          />
          <div class="heroContent">
            <h1 class="hotelName">{hotel()?.name}</h1>
            <p class="hotelDescription">{hotel()?.description}</p>

            <div class="amenities">
              <div class="amenity">
                <svg
                  class="amenityIcon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01M6.29 12.79a9 9 0 0111.42 0M1.69 8.89a14 14 0 0120.62 0" />
                </svg>
                Free WiFi
              </div>
              <div class="amenity">
                <svg
                  class="amenityIcon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 8h20" />
                </svg>
                Smart TV
              </div>
              <div class="amenity">
                <svg
                  class="amenityIcon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                  <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
                Room Service
              </div>
              <div class="amenity">
                <svg
                  class="amenityIcon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Air Conditioning
              </div>
            </div>
          </div>
        </div>

        <div class="contentGrid">
          <section class="section">
            <h2 class="sectionTitle">Available Rooms</h2>

            <div class="roomsGrid">
              <For each={hotel()?.room_types}>
                {(room) => (
                  <div
                    class={`roomCard ${selectedRoom()?.id === room.id ? "selected" : ""}`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div>
                      <h3 class="roomName">{room.name}</h3>
                    </div>
                    <div>
                      <p class="roomDescription">{room.description}</p>
                    </div>
                    <div class="roomPricing">
                      <div class="roomPrice">{formatPrice(room.price_per_night)}</div>
                      <div class="roomPriceLabel">per night</div>
                      <Button
                        variant={selectedRoom()?.id === room.id ? "primary" : "outline"}
                        size="small"
                        style={{ "margin-top": "var(--space-md)" }}
                      >
                        {selectedRoom()?.id === room.id ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </section>

          <aside class="bookingForm">
            <h3 class="bookingTitle">Book Your Stay</h3>

            <div class="dateInputs">
              <Input
                type="date"
                label="Check-in"
                value={checkIn()}
                onInput={(e) => setCheckIn(e.currentTarget.value)}
                min={today}
                required
              />
              <Input
                type="date"
                label="Check-out"
                value={checkOut()}
                onInput={(e) => setCheckOut(e.currentTarget.value)}
                min={checkIn() || today}
                required
              />
            </div>

            <Show when={selectedRoom()}>
              <div class="selectedRoom">
                <div class="selectedRoomLabel">Selected Room</div>
                <div class="selectedRoomName">{selectedRoom()?.name}</div>
              </div>

              <Show when={nights() > 0}>
                <div class="summaryLine">
                  <span>
                    {formatPrice(selectedRoom()?.price_per_night ?? 0)} x {nights()} night
                    {nights() > 1 ? "s" : ""}
                  </span>
                  <span>{formatPrice(totalPrice())}</span>
                </div>

                <div class="summaryTotal">
                  <span>Total</span>
                  <span class="totalPrice">{formatPrice(totalPrice())}</span>
                </div>
              </Show>
            </Show>

            <Button
              variant="primary"
              fullWidth
              disabled={!canBook()}
              loading={loading()}
              onClick={handleBook}
              style={{ "margin-top": "var(--space-lg)" }}
            >
              Book Now
            </Button>
            <Button
              variant="outline"
              fullWidth
              disabled={!canBook()}
              onClick={handleAddToCart}
              style={{ "margin-top": "var(--space-md)" }}
            >
              Add to Cart
            </Button>
          </aside>
        </div>
      </Show>
    </div>
  );
}
