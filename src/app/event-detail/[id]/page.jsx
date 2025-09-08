"use client";
import { useState, useEffect } from "react";
import EventDetailMain from "../../Components/EventDetailMain";
import Header from "../../Components/Header";
import { useParams } from "next/navigation";
import Footer from "../../Components/Footer";
import NetworkInstance from "../../Components/NetworkInstance";
export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState([]);
  const networkInstance = NetworkInstance();
  useEffect(() => {
    getEvents();
  }, []);
  const getEvents = async () => {
    try {
      const res = await networkInstance.get(`/event/${id}`);
      setEvent(res.data);
      console.log("Event data:", res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  return (
    <main className="pb-24">
      <Header />
      <EventDetailMain event={event} />
      <Footer />
    </main>
  );
}
