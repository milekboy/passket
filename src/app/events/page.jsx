"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import NetworkInstance from "../Components/NetworkInstance";
import EventPageMain from "../Components/EventPageMain";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const networkInstance = NetworkInstance();
  const searchParams = useSearchParams();

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      setLoading(true);
      const res = await networkInstance.get("/event");
      setEvents(res.data?.events || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filter events locally based on URL params
  const filteredEvents = useMemo(() => {
    if (!events.length) return [];

    const q = (searchParams.get("q") || "").toLowerCase();
    const city = (searchParams.get("city") || "").trim();
    const cats = searchParams.get("cats")
      ? searchParams
          .get("cats")
          .split(",")
          .map((c) => c.toLowerCase())
          .filter(Boolean)
      : [];
    const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;
    const date = searchParams.get("date") || "any";

    return events.filter((ev) => {
      const title = ev.title?.toLowerCase() || "";
      const desc = ev.description?.toLowerCase() || "";
      const location = ev.location?.toLowerCase() || "";
      const price = Number(ev.price) || 0;
      const category = ev.category?.toLowerCase() || "";
      const categories = ev.categories?.map((x) => x.toLowerCase()) || [];

      const matchQuery =
        !q || title.includes(q) || desc.includes(q) || location.includes(q);

      const matchCity = !city || location.includes(city.toLowerCase());

      const matchCats =
        !cats.length ||
        cats.some((c) => c === category || categories.includes(c));

      const matchPrice = price <= maxPrice;

      const matchDate =
        date === "any" ||
        (date === "today" && isToday(ev.startDate)) ||
        (date === "tomorrow" && isTomorrow(ev.startDate)) ||
        (date === "weekend" && isThisWeekend(ev.startDate));

      return matchQuery && matchCity && matchCats && matchPrice && matchDate;
    });
  }, [events, searchParams]);

  // Date helpers
  function isToday(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }
  function isTomorrow(dateStr) {
    const d = new Date(dateStr);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return d.toDateString() === tomorrow.toDateString();
  }
  function isThisWeekend(dateStr) {
    const d = new Date(dateStr);
    const day = d.getDay(); // 0=Sun,6=Sat
    return day === 0 || day === 6;
  }

  return (
    <main className="pb-24">
      <Header />
      {loading ? (
        <div className="text-center text-white py-10">Loading events...</div>
      ) : (
        <EventPageMain events={filteredEvents} />
      )}
      <Footer />
    </main>
  );
}
