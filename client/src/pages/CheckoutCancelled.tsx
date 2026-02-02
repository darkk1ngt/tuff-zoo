import { Button } from "../components/common";

export default function CheckoutCancelled() {
  return (
    <div class="page">
      <div class="card" style={{ "text-align": "center" }}>
        <div style={{ "font-size": "4rem", "margin-bottom": "var(--space-lg)" }}>
          <svg
            viewBox="0 0 24 24"
            width="80"
            height="80"
            fill="none"
            stroke="var(--color-warning)"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 class="title">Booking Cancelled</h1>
        <p class="subtitle" style={{ "margin-bottom": "var(--space-xl)" }}>
          Your booking was not completed. No charges have been made to your account.
        </p>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            gap: "var(--space-md)",
          }}
        >
          <Button href="/book" variant="primary" fullWidth>
            Try Again
          </Button>
          <Button href="/" variant="outline" fullWidth>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
