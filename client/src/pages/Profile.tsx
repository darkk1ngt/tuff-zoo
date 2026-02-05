import { useNavigate } from "@solidjs/router";
import { createResource, For, Show } from "solid-js";
import { getUserBookings } from "../api/bookings";
import { ProtectedRoute } from "../components/auth";
import { Button } from "../components/common";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";
import type { Booking } from "../types";
import { formatDate, formatPrice } from "../utils/formatters";

function ProfileContent() {
  const auth = useAuth();
  const flash = useFlash();
  const navigate = useNavigate();

  const [bookings] = createResource(getUserBookings);

  const handleLogout = async () => {
    await auth.logout();
    flash.showSuccess("You have been logged out");
    navigate("/");
  };

  const user = () => auth.user();

  const getStatusClass = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "statusPending";
      case "confirmed":
        return "statusConfirmed";
      case "cancelled":
        return "statusCancelled";
      case "completed":
        return "statusCompleted";
      default:
        return "";
    }
  };

  const getInitial = () => {
    const name = user()?.name;
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div class="page">
      <div class="header">
        <h1 class="title">My Account</h1>
        <p class="subtitle">Manage your profile and view your bookings</p>
      </div>

      <div class="grid">
        <aside class="sidebar">
          <div class="userCard">
            <div class="avatar">{getInitial()}</div>
            <h2 class="userName">{user()?.name}</h2>
            <p class="userEmail">{user()?.email}</p>
            <span class="badge">{user()?.role}</span>
            <div class="logoutButton">
              <Button variant="outline" fullWidth onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        <main class="profileMain">
          <section class="section">
            <h2 class="sectionTitle">My Bookings</h2>

            <Show
              when={!bookings.loading}
              fallback={<div class="emptyState">Loading bookings...</div>}
            >
              <Show
                when={bookings()?.length}
                fallback={
                  <div class="emptyState">
                    <p>You haven't made any bookings yet.</p>
                    <Button href="/book" variant="primary" style={{ "margin-top": "1rem" }}>
                      Book Your Visit
                    </Button>
                  </div>
                }
              >
                <div class="bookingsList">
                  <For each={bookings()}>
                    {(booking) => (
                      <div class="bookingItem">
                        <div class="bookingInfo">
                          <span class="bookingType">
                            {booking.booking_type === "ticket" ? "Zoo Tickets" : "Hotel Stay"}
                            {booking.quantity > 1 && ` (x${booking.quantity})`}
                          </span>
                          <span class="bookingDate">
                            {booking.check_in
                              ? `${formatDate(booking.check_in)} - ${formatDate(booking.check_out!)}`
                              : formatDate(booking.created_at)}
                          </span>
                          <span class="bookingDate">Total: {formatPrice(booking.total_price)}</span>
                        </div>
                        <span class={`bookingStatus ${getStatusClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </Show>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
