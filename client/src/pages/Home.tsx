import {
  AccommodationSection,
  EducationalSection,
  TestimonialsSection,
} from '../components/home';

export default function Home() {
  return (
    <section class="homeIntro">
      <div class="homeIntroContent">
        <h1>Riget Zoo Adventures</h1>
        <p>Use the links below to test booking, hotels, gallery, and admin features.</p>
        <div class="homeIntroActions">
          <a class="button" href="/book">
            Book Tickets
          </a>
          <a class="button outline" href="/hotels">
            Hotel Booking
          </a>
          <a class="button outline" href="/gallery">
            Gallery
          </a>
          <a class="button outline" href="/admin">
            Admin
          </a>
        </div>
      </div>
    </section>
  );
}
