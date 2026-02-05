import { A, useLocation } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { Button } from "./Button";

export function Nav() {
  const [menuOpen, setMenuOpen] = createSignal(false);
  const location = useLocation();
  const auth = useAuth();
  const cart = useCart();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setMenuOpen(!menuOpen());
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav class="nav">
        <div class="container">
          <A href="/" class="logo" onClick={closeMenu}>
            <span class="logoText">Riget Zoo</span>
          </A>

          <div class="links">
            <A href="/" class={`link ${isActive("/") ? "active" : ""}`}>
              Home
            </A>
            <A href="/about" class={`link ${isActive("/about") ? "active" : ""}`}>
              About Us
            </A>
            <A href="/edu-visit" class={`link ${isActive("/edu-visit") ? "active" : ""}`}>
              EduVisit
            </A>
            <A href="/book" class={`link ${isActive("/book") ? "active" : ""}`}>
              Book
            </A>
            <A href="/cart" class={`link ${isActive("/cart") ? "active" : ""}`}>
              Cart
              <Show when={cart.itemCount() > 0}>
                <span class="cartBadge">{cart.itemCount()}</span>
              </Show>
            </A>
          </div>

          <div class="actions">
            <Show
              when={auth.isAuthenticated()}
              fallback={
                <Button href="/login" variant="primary">
                  Login
                </Button>
              }
            >
              <Show when={auth.isAdmin()}>
                <Button href="/admin" variant="outline" size="small">
                  Admin
                </Button>
              </Show>
              <Button href="/profile" variant="primary">
                My Account
              </Button>
            </Show>
          </div>

          <button
            type="button"
            class={`hamburger ${menuOpen() ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={menuOpen()}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div class={`mobileMenu ${menuOpen() ? "open" : ""}`}>
        <div class="mobileLinks">
          <A href="/" class={`mobileLink ${isActive("/") ? "active" : ""}`} onClick={closeMenu}>
            Home
          </A>
          <A
            href="/about"
            class={`mobileLink ${isActive("/about") ? "active" : ""}`}
            onClick={closeMenu}
          >
            About Us
          </A>
          <A
            href="/edu-visit"
            class={`mobileLink ${isActive("/edu-visit") ? "active" : ""}`}
            onClick={closeMenu}
          >
            EduVisit
          </A>
          <A
            href="/book"
            class={`mobileLink ${isActive("/book") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Book
          </A>
          <A
            href="/cart"
            class={`mobileLink ${isActive("/cart") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Cart
            <Show when={cart.itemCount() > 0}>
              <span class="cartBadge">{cart.itemCount()}</span>
            </Show>
          </A>
        </div>

        <div class="mobileActions">
          <Show
            when={auth.isAuthenticated()}
            fallback={
              <>
                <Button href="/login" variant="primary" fullWidth onClick={closeMenu}>
                  Login
                </Button>
                <Button href="/register" variant="secondary" fullWidth onClick={closeMenu}>
                  Register
                </Button>
              </>
            }
          >
            <Show when={auth.isAdmin()}>
              <Button href="/admin" variant="outline" fullWidth onClick={closeMenu}>
                Admin Dashboard
              </Button>
            </Show>
            <Button href="/profile" variant="primary" fullWidth onClick={closeMenu}>
              My Account
            </Button>
          </Show>
        </div>
      </div>
    </>
  );
}
