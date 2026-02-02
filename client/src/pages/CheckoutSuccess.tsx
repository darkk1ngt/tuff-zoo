import { Button } from "../components/common";

export default function CheckoutSuccess() {
  return (
    <div class="page">
      <div class="card" style={{ "text-align": "center" }}>
        <div style={{ "font-size": "4rem", "margin-bottom": "var(--space-lg)" }}>
          <svg
            viewBox="0 0 24 24"
            width="80"
            height="80"
            fill="none"
            stroke="var(--color-success)"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h1 class="title">Booking Confirmed!</h1>
        <p class="subtitle" style={{ "margin-bottom": "var(--space-xl)" }}>
          Thank you for your booking. A confirmation email has been sent to your registered email
          address.
        </p>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            gap: "var(--space-md)",
          }}
        >
          <Button href="/profile" variant="primary" fullWidth>
            View My Bookings
          </Button>
          <Button href="/" variant="outline" fullWidth>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
