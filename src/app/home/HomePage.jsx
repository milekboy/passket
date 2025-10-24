"use client";
import Header from "../Components/Header";
import { useRef, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HeroCarousel from "../Components/Hero";
import SearchFilters from "../Components/SearchFilter";
import TrendingRail from "../Components/TrendingRail";
import HowItWorks from "../Components/HowItWorks";
import OrganiserCTA from "../Components/OrganisersCTA";
import MiniFAQ from "../Components/MiniFaq";
import Footer from "../Components/Footer";
import NetworkInstance from "../Components/NetworkInstance";

function ScrollHandler({ featuresRef, contactRef, faqRef, companyRef }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollTarget = searchParams.get("scroll");
    if (scrollTarget === "contact") {
      contactRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (scrollTarget === "services") {
      featuresRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (scrollTarget === "faq") {
      faqRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (scrollTarget === "company") {
      companyRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchParams, contactRef, featuresRef, faqRef, companyRef]);

  return null;
}

export default function HomePage() {
  const contactRef = useRef(null);
  const featuresRef = useRef(null);
  const faqRef = useRef(null);
  const companyRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [slides, setSlides] = useState([]);

  const networkInstance = NetworkInstance();

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      const res = await networkInstance.get("/event");
      const allEvents = res.data.events;
      setEvents(allEvents);

      // ✅ Create slides from first 3 events
      const heroSlides = allEvents.slice(0, 3).map((event) => ({
        image: event.imageUrl,
        kicker: event.category || "Featured Event",
        title: event.title,
        subtitle: event.description
          ? event.description.slice(0, 100)
          : "Join us for something amazing!",
        ctaText: "Get Tickets",
        ctaHref: `/event-detail/${event.id}`,
      }));

      // ✅ If no events or less than 3, use fallback slides
      if (heroSlides.length < 3) {
        const fallbackSlides = [
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

        setSlides([...heroSlides, ...fallbackSlides.slice(heroSlides.length)]);
      } else {
        setSlides(heroSlides);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <div>
      <Header
        handleContactClick={() =>
          contactRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        handleCompanyClick={() =>
          companyRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        handleFaqClick={() =>
          faqRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <Suspense fallback={null}>
        <ScrollHandler
          contactRef={contactRef}
          featuresRef={featuresRef}
          faqRef={faqRef}
          companyRef={companyRef}
        />
      </Suspense>

      <HeroCarousel slides={slides} />

      <SearchFilters />
      <TrendingRail events={events} />
      <HowItWorks ref={companyRef} />
      <OrganiserCTA brandName="Passket" />
      <MiniFAQ ref={faqRef} />
      <Footer />
    </div>
  );
}
