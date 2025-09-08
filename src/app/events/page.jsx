// app/events/page.jsx
"use client";
import { useState, useEffect } from "react";
import NetworkInstance from "../Components/NetworkInstance";
import EventPageMain from "../Components/EventPageMain";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const networkInstance = NetworkInstance();
  useEffect(() => {
    getEvents();
  }, []);
  const getEvents = async () => {
    try {
      const res = await networkInstance.get("/event");
      setEvents(res.data.events);
      console.log("Events data:", res.data.events);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  return (
    <main className="pb-24">
      <Header />
      <EventPageMain events={events} />
      <Footer />
    </main>
  );
}
