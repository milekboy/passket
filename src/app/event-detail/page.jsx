// app/events/[id]/page.jsx
import EventDetailMain from "../Components/EventDetailMain";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const demoEvent = {
  id: "techfest-2025",
  title: "Lagos Tech Fest 2025",
  coverImage:
    "https://res.cloudinary.com/dbpjskran/image/upload/v1754989530/event_nrufbc.jpg",
  startsAt: "2025-10-04T09:00:00+01:00",
  endsAt: "2025-10-04T18:00:00+01:00",
  venueName: "Landmark Centre",
  address: "Water Corporation Dr, Oniru, Lagos",
  city: "Lagos",
  organiser: "TechFest Africa",
  descriptionHtml: `<p>Join Africa’s brightest minds in technology for a full day of talks, workshops, and networking.</p>
  <ul><li>Keynotes by global speakers</li><li>Startup showcase</li><li>Hands-on labs</li></ul>`,
  tickets: [
    {
      id: "early",
      name: "Early Bird",
      subtitle: "Limited quantity",
      price: 5000,
      qtyAvailable: 120,
      maxPerOrder: 6,
      badge: "Early bird",
    },
    {
      id: "regular",
      name: "Regular",
      price: 8000,
      qtyAvailable: 300,
      maxPerOrder: 10,
    },
    {
      id: "vip",
      name: "VIP",
      subtitle: "Front row + lounge",
      price: 20000,
      qtyAvailable: 30,
      maxPerOrder: 4,
    },
  ],
};

export default function EventDetailPage() {
  return (
    <main className="pb-24">
      <Header />
      <EventDetailMain event={demoEvent} />
      <Footer />
    </main>
  );
}
