import Header from "../Components/Header";
import HeroCarousel from "../Components/Hero";
import SearchFilters from "../Components/SearchFilter";
import TrendingRail from "../Components/TrendingRail";
import HowItWorks from "../Components/HowItWorks";
import OrganiserCTA from "../Components/OrganisersCTA";
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
  const demoEvents = [
    {
      id: "d1z",
      title: "D1Z World Tour – Lagos Night 1",
      date: "Fri, Sep 12 • 7:00 PM",
      venue: "Eko Convention Centre",
      priceFrom: 15000,
      image:
        "https://res.cloudinary.com/dbpjskran/image/upload/v1754989530/event_nrufbc.jpg",
      badge: "Few left",
    },
    {
      id: "d1zf",
      title: "D1Z World Tour – Lagos Night 1",
      date: "Fri, Sep 12 • 7:00 PM",
      venue: "Eko Convention Centre",
      priceFrom: 15000,
      image:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1920&auto=format&fit=crop",
      badge: "Few left",
    },
    {
      id: "techfest",
      title: "Lagos Tech Fest 2025",
      date: "Sat, Sep 20 • 9:00 AM",
      venue: "Landmark Centre",
      priceFrom: 5000,
      image:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1920&auto=format&fit=crop",
      badge: "Early bird",
    },
    {
      id: "laughcity",
      title: "Laugh City: XXL Comedy Special",
      date: "Sun, Sep 28 • 6:30 PM",
      venue: "Terra Kulture",
      priceFrom: 7000,
      image:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1920&auto=format&fit=crop",
    },
    {
      id: "derby",
      title: "Island Derby – 5-A-Side Finals",
      date: "Sat, Oct 4 • 4:00 PM",
      venue: "Oniru Arena",
      priceFrom: 3000,
      image:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1920&auto=format&fit=crop",
    },
  ];
  return (
    <div>
      <Header />
      <HeroCarousel slides={slides} />
      <SearchFilters />
      <TrendingRail events={demoEvents} />
      <HowItWorks />
      <OrganiserCTA brandName="Passket" />
    </div>
  );
}
