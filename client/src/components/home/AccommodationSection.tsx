import { Button } from "../common/Button";

export function AccommodationSection() {
  return (
    <section class="section">
      <div class="container">
        <div class="imageWrapper">
          <img
            src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80"
            alt="Luxury hotel room"
            class="image"
          />
        </div>
        <div class="content">
          <span class="subtitle">Stay With Us</span>
          <h2 class="title">Extend Your Adventure</h2>
          <p class="description">
            Make the most of your visit by staying at one of our on-site hotels. Wake up to the
            sounds of nature, enjoy exclusive after-hours zoo access, and experience wildlife from
            sunrise to sunset.
          </p>
          <div class="highlights">
            <div class="highlight">
              <svg
                class="highlightIcon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span class="highlightText">Premium Rooms</span>
            </div>
            <div class="highlight">
              <svg
                class="highlightIcon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span class="highlightText">Early Access</span>
            </div>
            <div class="highlight">
              <svg
                class="highlightIcon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M18 8h1a4 4 0 010 8h-1" />
                <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
              <span class="highlightText">Free Breakfast</span>
            </div>
            <div class="highlight">
              <svg
                class="highlightIcon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span class="highlightText">Wildlife Views</span>
            </div>
          </div>
          <Button href="/hotels" variant="primary" class="button">
            View Accommodations
          </Button>
        </div>
      </div>
    </section>
  );
}
