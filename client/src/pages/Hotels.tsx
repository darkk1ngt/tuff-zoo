import { createResource, For, Show } from "solid-js";
import { getHotels } from "../api/hotels";
import { Button } from "../components/common";
import { formatPrice } from "../utils/formatters";

export default function Hotels() {
  const [hotels] = createResource(getHotels);

  const getLowestPrice = (hotel: { room_types: { price_per_night: number }[] }) => {
    if (!hotel.room_types?.length) return 0;
    return Math.min(...hotel.room_types.map((r) => r.price_per_night));
  };

  return (
    <div class="page">
      <div class="header">
        <h1 class="title">Our Accommodations</h1>
        <p class="subtitle">
          Stay close to nature in our comfortable on-site hotels. Wake up to wildlife and enjoy
          exclusive after-hours access to the zoo.
        </p>
      </div>

      <Show when={!hotels.loading} fallback={<div class="emptyState">Loading hotels...</div>}>
        <Show
          when={hotels()?.length}
          fallback={
            <div class="emptyState">
              No hotels available at the moment. Please check back later.
            </div>
          }
        >
          <div class="grid">
            <For each={hotels()}>
              {(hotel) => (
                <div class="hotelCard">
                  <img
                    src={
                      hotel.image_url ||
                      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80"
                    }
                    alt={hotel.name}
                    class="hotelImage"
                  />
                  <div class="hotelContent">
                    <h2 class="hotelName">{hotel.name}</h2>
                    <p class="hotelDescription">{hotel.description}</p>
                    <div class="hotelMeta">
                      <div class="hotelPrice">
                        <span class="priceValue">From {formatPrice(getLowestPrice(hotel))}</span>
                        <span class="priceLabel">per night</span>
                      </div>
                      <Button href={`/hotels/${hotel.id}`} variant="primary" size="small">
                        View Rooms
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}
