import { Button } from "../components/common";

export default function NotFound() {
  return (
    <div class="page">
      <div class="card" style={{ "text-align": "center" }}>
        <div
          style={{
            "font-size": "6rem",
            "margin-bottom": "var(--space-lg)",
            "line-height": "1",
          }}
        >
          404
        </div>
        <h1 class="title">Page Not Found</h1>
        <p class="subtitle" style={{ "margin-bottom": "var(--space-xl)" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            gap: "var(--space-md)",
          }}
        >
          <Button href="/" variant="primary" fullWidth>
            Back to Home
          </Button>
          <Button href="/book" variant="outline" fullWidth>
            Book a Visit
          </Button>
        </div>
      </div>
    </div>
  );
}
