import { Button } from "../common/Button";

export function EducationalSection() {
  return (
    <section class="section">
      <div class="container">
        <div class="content">
          <span class="subtitle">Educational Programs</span>
          <h2 class="title">Learn While You Explore</h2>
          <p class="description">
            Our educational programs bring wildlife to life for visitors of all ages. From school
            field trips to interactive workshops, we offer experiences that inspire a deeper
            connection with the natural world.
          </p>
          <div class="features">
            <div class="feature">
              <svg
                class="featureIcon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span class="featureText">Guided tours led by expert zoologists</span>
            </div>
            <div class="feature">
              <svg
                class="featureIcon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span class="featureText">Hands-on animal encounters for all ages</span>
            </div>
            <div class="feature">
              <svg
                class="featureIcon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span class="featureText">Conservation workshops and talks</span>
            </div>
          </div>
          <Button href="/edu-visit" variant="primary" class="button">
            Discover Our Programs
          </Button>
        </div>
        <div class="imageWrapper">
          <img
            src="https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&q=80"
            alt="Giraffe portrait"
            class="image"
          />
        </div>
      </div>
    </section>
  );
}
