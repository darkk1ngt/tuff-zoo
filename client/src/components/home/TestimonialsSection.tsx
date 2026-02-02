import { For } from "solid-js";

const testimonials = [
  {
    id: 1,
    quote:
      "An incredible experience for the whole family! The kids loved the interactive exhibits and we learned so much about conservation. Can't wait to come back!",
    author: "Sarah Johnson",
    role: "Family Visitor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "The hotel stay was fantastic. Waking up to see giraffes outside our window was magical. The staff went above and beyond to make our anniversary special.",
    author: "Michael Chen",
    role: "Hotel Guest",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "As an educator, I was impressed by the quality of the school programs. The guides were knowledgeable and engaging. My students still talk about it!",
    author: "Emma Williams",
    role: "School Teacher",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5,
  },
];

function StarIcon() {
  return (
    <svg class="star" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function TestimonialsSection() {
  return (
    <section class="section">
      <div class="container">
        <div class="header">
          <span class="subtitle">Testimonials</span>
          <h2 class="title">What Our Visitors Say</h2>
        </div>
        <div class="grid">
          <For each={testimonials}>
            {(testimonial) => (
              <div class="testimonial">
                <div class="stars">
                  <For each={Array(testimonial.rating).fill(0)}>{() => <StarIcon />}</For>
                </div>
                <p class="quote">{testimonial.quote}</p>
                <div class="author">
                  <img src={testimonial.avatar} alt={testimonial.author} class="avatar" />
                  <div class="authorInfo">
                    <span class="authorName">{testimonial.author}</span>
                    <span class="authorRole">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
