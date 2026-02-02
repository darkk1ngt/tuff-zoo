import { A } from "@solidjs/router";

export function Hero() {
  return (
    <section class="hero">
      <div class="background">
        <img
          src="https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=1920&q=80"
          alt="Brown bears in their natural habitat"
          class="backgroundImage"
        />
        <div class="overlay" />
      </div>
      <div class="content">
        <h1 class="title">Explore The Wildlife</h1>
        <p class="subtitle">
          Experience wildlife like never before. Explore our world-class exhibits, connect with
          nature, and create memories that last a lifetime.
        </p>
        <div class="actions">
          <A href="/about" class="primaryButton">
            Explore More
          </A>
        </div>
      </div>
    </section>
  );
}
