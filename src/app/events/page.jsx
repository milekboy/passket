// app/events/page.jsx

import EventPageMain from "../Components/EventPageMain";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
const demoEvents = [
  {
    id: "1",
    title: "Afrobeats Live",
    date: "Fri, Sep 26 • 7:00 PM",
    venue: "Eko Convention Centre",
    priceFrom: 15000,
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1920&auto=format&fit=crop",
    badge: "Few left",
    category: "music",
  },
  {
    id: "2",
    title: "Lagos Tech Fest 2025",
    date: "Sat, Oct 4 • 9:00 AM",
    venue: "Landmark Centre",
    priceFrom: 5000,
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1920&auto=format&fit=crop",
    badge: "Early bird",
    category: "tech",
  },
  {
    id: "3",
    title: "Laugh City XXL",
    date: "Sun, Oct 12 • 6:30 PM",
    venue: "Terra Kulture",
    priceFrom: 7000,
    image:
      "https://res.cloudinary.com/dbpjskran/image/upload/v1754989530/event_nrufbc.jpg",
    category: "comedy",
  },
  {
    id: "4",
    title: "Island Derby Finals",
    date: "Sat, Oct 18 • 4:00 PM",
    venue: "Oniru Arena",
    priceFrom: 3000,
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1920&auto=format&fit=crop",
    category: "sports",
  },
  {
    id: "5",
    title: "Theatre Night",
    date: "Sat, Nov 1 • 7:30 PM",
    venue: "Muson Centre",
    priceFrom: 8000,
    image:
      "https://res.cloudinary.com/dbpjskran/image/upload/v1754989530/event_nrufbc.jpg",
    category: "theatre",
  },
  {
    id: "6",
    title: "Family Day Out",
    date: "Sun, Nov 9 • 1:00 PM",
    venue: "Lekki Gardens",
    priceFrom: 2000,
    image:
      "https://res.cloudinary.com/dbpjskran/image/upload/v1754989530/event_nrufbc.jpg",
    category: "family",
  },
];

export default function EventsPage() {
  return (
    <main className="pb-24">
      <Header />
      <EventPageMain events={demoEvents} />
      <Footer />
    </main>
  );
}
