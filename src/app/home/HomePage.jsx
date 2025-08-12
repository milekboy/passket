import Header from "../Components/Header";
import HeroCarousel from "../Components/Hero";
export default function HomePage() {
  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920&auto=format&fit=crop",
      kicker: "Live Concert",
      title: "AANUADE",
      subtitle:
        "Don’t miss AAnuade's live concert! Secure your seats today for an unforgettable night of music, emotion, and energy!",
      ctaText: "Tickets On Sale Now",
      ctaHref: "/events/olivia-rodrigo",
    },
    {
      image:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1920&auto=format&fit=crop",
      kicker: "World Tour",
      title: "D1Z",
      subtitle: "Experience the magic—limited seats available.",
      ctaText: "Get Tickets",
      ctaHref: "/events/frank-ocean",
    },
    {
      image:
        "https://res.cloudinary.com/dbpjskran/image/upload/v1754989530/event_nrufbc.jpg",
      kicker: "One Night Only",
      title: "WIZKID",
      subtitle: "Lights. Sound. Energy. Be there.",
      ctaText: "Book Now",
      ctaHref: "/events/dua-lipa",
    },
  ];
  return (
    <div>
      <Header />
      <HeroCarousel slides={slides} />
    </div>
  );
}
