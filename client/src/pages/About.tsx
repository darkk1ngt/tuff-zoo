import { Button } from "../components/common";

export default function About() {
  return (
    <div class="page">
      <div class="hero">
        <h1 class="title">About Riget Zoo Adventures</h1>
        <p class="subtitle">
          For over 50 years, we've been dedicated to wildlife conservation, education, and creating
          unforgettable experiences for visitors of all ages.
        </p>
      </div>

      <div class="stats">
        <div>
          <div class="statValue">500+</div>
          <div class="statLabel">Animal Species</div>
        </div>
        <div>
          <div class="statValue">50+</div>
          <div class="statLabel">Years of Excellence</div>
        </div>
        <div>
          <div class="statValue">1M+</div>
          <div class="statLabel">Annual Visitors</div>
        </div>
        <div>
          <div class="statValue">30+</div>
          <div class="statLabel">Conservation Programs</div>
        </div>
      </div>

      <section class="section">
        <div class="gridTwo">
          <div>
            <h2 class="sectionTitle">Our Mission</h2>
            <p class="text">
              At Riget Zoo Adventures, we believe that connecting people with wildlife inspires
              conservation action. Our mission is to be a leader in animal care, conservation,
              research, and education.
            </p>
            <p class="text">
              Every visit to our zoo supports vital conservation programs around the world, from
              protecting endangered species to preserving critical habitats.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&q=80"
            alt="Lions at the zoo"
            class="image"
          />
        </div>
      </section>

      <section class="section">
        <h2 class="sectionTitle">Our Values</h2>
        <div class="grid">
          <div class="card">
            <svg
              class="cardIcon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M4.93 19.07A10 10 0 1119.07 4.93 10 10 0 014.93 19.07z" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
            <h3 class="cardTitle">Conservation</h3>
            <p class="cardText">
              Committed to protecting endangered species and their habitats through breeding
              programs and field conservation.
            </p>
          </div>
          <div class="card">
            <svg
              class="cardIcon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
            </svg>
            <h3 class="cardTitle">Education</h3>
            <p class="cardText">
              Inspiring the next generation of conservationists through engaging educational
              programs and experiences.
            </p>
          </div>
          <div class="card">
            <svg
              class="cardIcon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <h3 class="cardTitle">Animal Welfare</h3>
            <p class="cardText">
              Ensuring the highest standards of care for all animals in our collection, prioritizing
              their physical and mental well-being.
            </p>
          </div>
        </div>
      </section>

      <div class="cta">
        <h2 class="ctaTitle">Visit Us Today</h2>
        <p class="ctaText">
          Experience the wonder of wildlife and support conservation at the same time.
        </p>
        <Button href="/book" variant="secondary">
          Book Your Visit
        </Button>
      </div>
    </div>
  );
}
