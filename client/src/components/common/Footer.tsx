import { A } from "@solidjs/router";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer class="siteFooter">
      <div class="container">
        <div class="grid">
          <div class="column">
            <span class="logo">Riget Zoo</span>
            <p class="description">Demo site for booking and admin features.</p>
            <a class="link" href="mailto:info@rigetzoo.com">
              info@rigetzoo.com
            </a>
          </div>

        </div>

        <div class="bottom">
          <p class="copyright">&copy; {currentYear} Riget Zoo Adventures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
