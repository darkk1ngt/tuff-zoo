import { A, useLocation } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, Show } from "solid-js";
import { deleteUser, getUsers } from "../api/admin";
import { getAllBookings, updateBookingStatus } from "../api/bookings";
import { deleteImage, getGalleryImages, uploadImage } from "../api/gallery";
import { getTickets, updateTicket } from "../api/tickets";
import { ProtectedRoute } from "../components/auth";
import { Button, Input, Modal } from "../components/common";
import { useFlash } from "../contexts/FlashContext";
import type { Booking, Ticket } from "../types";
import { formatDate, formatPrice } from "../utils/formatters";

type AdminTab = "overview" | "users" | "bookings" | "tickets" | "gallery";

function AdminContent() {
  const location = useLocation();
  const flash = useFlash();
  const [activeTab, setActiveTab] = createSignal<AdminTab>("overview");

  const [users, { refetch: refetchUsers }] = createResource(getUsers);
  const [bookings, { refetch: refetchBookings }] = createResource(getAllBookings);
  const [tickets, { refetch: refetchTickets }] = createResource(getTickets);
  const [galleryImages, { refetch: refetchGallery }] = createResource(getGalleryImages);

  const [editingTicket, setEditingTicket] = createSignal<Ticket | null>(null);
  const [ticketPrice, setTicketPrice] = createSignal("");

  createEffect(() => {
    const path = location.pathname.replace("/admin", "").replace("/", "") || "overview";
    setActiveTab(path as AdminTab);
  });

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      flash.showSuccess("User deleted");
      refetchUsers();
    } catch {
      flash.showError("Failed to delete user");
    }
  };

  const handleUpdateBookingStatus = async (id: number, status: Booking["status"]) => {
    try {
      await updateBookingStatus(id, status);
      flash.showSuccess("Booking updated");
      refetchBookings();
    } catch {
      flash.showError("Failed to update booking");
    }
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setTicketPrice(ticket.price.toString());
  };

  const handleSaveTicket = async () => {
    const ticket = editingTicket();
    if (!ticket) return;
    try {
      await updateTicket(ticket.id, { price: parseFloat(ticketPrice()) });
      flash.showSuccess("Ticket price updated");
      setEditingTicket(null);
      refetchTickets();
    } catch {
      flash.showError("Failed to update ticket");
    }
  };

  const handleDeleteGalleryImage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteImage(id);
      flash.showSuccess("Image deleted");
      refetchGallery();
    } catch {
      flash.showError("Failed to delete image");
    }
  };

  const handleFileUpload = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("alt", file.name.replace(/\.[^/.]+$/, ""));

    try {
      await uploadImage(formData);
      flash.showSuccess("Image uploaded");
      refetchGallery();
    } catch {
      flash.showError("Failed to upload image");
    }
    input.value = "";
  };

  const getStatusBadgeClass = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "badgePending";
      case "confirmed":
        return "badgeConfirmed";
      case "cancelled":
        return "badgeCancelled";
      case "completed":
        return "badgeCompleted";
      default:
        return "";
    }
  };

  return (
    <div class="layout">
      <aside class="sidebar">
        <h2 class="sidebarTitle">Admin Panel</h2>
        <nav class="navLinks">
          <A href="/admin" class={`navLink ${activeTab() === "overview" ? "active" : ""}`} end>
            <svg
              class="navIcon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            Overview
          </A>
          <A href="/admin/users" class={`navLink ${activeTab() === "users" ? "active" : ""}`}>
            <svg
              class="navIcon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            Users
          </A>
          <A href="/admin/bookings" class={`navLink ${activeTab() === "bookings" ? "active" : ""}`}>
            <svg
              class="navIcon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Bookings
          </A>
          <A href="/admin/tickets" class={`navLink ${activeTab() === "tickets" ? "active" : ""}`}>
            <svg
              class="navIcon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M2 9a3 3 0 003 3v4a2 2 0 002 2h10a2 2 0 002-2v-4a3 3 0 000-6V6a2 2 0 00-2-2H7a2 2 0 00-2 2v2a3 3 0 00-3 3z" />
            </svg>
            Tickets
          </A>
          <A href="/admin/gallery" class={`navLink ${activeTab() === "gallery" ? "active" : ""}`}>
            <svg
              class="navIcon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Gallery
          </A>
        </nav>
      </aside>

      <main class="main">
        <Show when={activeTab() === "overview"}>
          <div class="header">
            <h1 class="title">Dashboard Overview</h1>
          </div>
          <div class="statsGrid">
            <div class="statCard">
              <div class="statValue">{users()?.length || 0}</div>
              <div class="statLabel">Total Users</div>
            </div>
            <div class="statCard">
              <div class="statValue">{bookings()?.length || 0}</div>
              <div class="statLabel">Total Bookings</div>
            </div>
            <div class="statCard">
              <div class="statValue">
                {bookings()?.filter((b) => b.status === "confirmed").length || 0}
              </div>
              <div class="statLabel">Confirmed</div>
            </div>
            <div class="statCard">
              <div class="statValue">
                {formatPrice(bookings()?.reduce((sum, b) => sum + b.total_price, 0) || 0)}
              </div>
              <div class="statLabel">Revenue</div>
            </div>
          </div>
        </Show>

        <Show when={activeTab() === "users"}>
          <div class="header">
            <h1 class="title">User Management</h1>
          </div>
          <div class="section">
            <Show
              when={!users.loading && users()?.length}
              fallback={<div class="emptyState">Loading users...</div>}
            >
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={users()}>
                    {(user) => (
                      <tr>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span
                            class={`badge ${user.role === "admin" ? "badgeAdmin" : "badgeUser"}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <div class="actions">
                            <button
                              class="actionButton danger"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </Show>
          </div>
        </Show>

        <Show when={activeTab() === "bookings"}>
          <div class="header">
            <h1 class="title">Booking Management</h1>
          </div>
          <div class="section">
            <Show
              when={!bookings.loading && bookings()?.length}
              fallback={<div class="emptyState">Loading bookings...</div>}
            >
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={bookings()}>
                    {(booking) => (
                      <tr>
                        <td>{booking.id}</td>
                        <td>{booking.user_id}</td>
                        <td>{booking.booking_type}</td>
                        <td>{formatDate(booking.created_at)}</td>
                        <td>{formatPrice(booking.total_price)}</td>
                        <td>
                          <span class={`badge ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <div class="actions">
                            <Show when={booking.status === "pending"}>
                              <button
                                class="actionButton"
                                onClick={() => handleUpdateBookingStatus(booking.id, "confirmed")}
                              >
                                Confirm
                              </button>
                            </Show>
                            <Show when={booking.status !== "cancelled"}>
                              <button
                                class="actionButton danger"
                                onClick={() => handleUpdateBookingStatus(booking.id, "cancelled")}
                              >
                                Cancel
                              </button>
                            </Show>
                          </div>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </Show>
          </div>
        </Show>

        <Show when={activeTab() === "tickets"}>
          <div class="header">
            <h1 class="title">Ticket Management</h1>
          </div>
          <div class="section">
            <Show
              when={!tickets.loading && tickets()?.length}
              fallback={<div class="emptyState">Loading tickets...</div>}
            >
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={tickets()}>
                    {(ticket) => (
                      <tr>
                        <td>{ticket.id}</td>
                        <td>{ticket.type}</td>
                        <td>{ticket.description}</td>
                        <td>{formatPrice(ticket.price)}</td>
                        <td>
                          <div class="actions">
                            <button class="actionButton" onClick={() => handleEditTicket(ticket)}>
                              Edit Price
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </Show>
          </div>
        </Show>

        <Show when={activeTab() === "gallery"}>
          <div class="header">
            <h1 class="title">Gallery Management</h1>
          </div>
          <div class="section">
            <div class="uploadArea">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="gallery-upload"
              />
              <label for="gallery-upload" style={{ cursor: "pointer" }}>
                <svg
                  class="uploadIcon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p class="uploadText">Click to upload an image</p>
              </label>
            </div>

            <Show when={galleryImages()?.length}>
              <div class="galleryGrid" style={{ "margin-top": "var(--space-xl)" }}>
                <For each={galleryImages()}>
                  {(image) => (
                    <div class="galleryItem">
                      <img src={image.url} alt={image.alt} class="galleryImage" />
                      <button
                        class="galleryDelete"
                        onClick={() => handleDeleteGalleryImage(image.id)}
                        aria-label="Delete image"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </Show>
      </main>

      <Modal
        isOpen={!!editingTicket()}
        onClose={() => setEditingTicket(null)}
        title="Edit Ticket Price"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditingTicket(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveTicket}>
              Save
            </Button>
          </>
        }
      >
        <div class="form">
          <Input
            type="number"
            label="Price"
            value={ticketPrice()}
            onInput={(e) => setTicketPrice(e.currentTarget.value)}
            min="0"
            step="0.01"
          />
        </div>
      </Modal>
    </div>
  );
}

export default function Admin() {
  return (
    <ProtectedRoute adminOnly>
      <AdminContent />
    </ProtectedRoute>
  );
}
