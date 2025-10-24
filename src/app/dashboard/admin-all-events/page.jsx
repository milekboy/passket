"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "../DashboardLayout";
import NetworkInstance from "../../Components/NetworkInstance";
import Toast from "../../Components/Toast";
import { useAuth } from "@/app/Components/AuthContext";

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

export default function AdminEventsPage() {
  const api = NetworkInstance();
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => setToast({ type, message });

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Event/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list =
        res?.data?.events ??
        res?.data?.data ??
        (Array.isArray(res?.data) ? res.data : []) ??
        [];
      setEvents(list);
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Delete event
  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await api.delete(`/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("success", "Event deleted.");
      fetchEvents();
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to delete event.");
    }
  };

  // Publish / Unpublish
  const togglePublish = async (event) => {
    try {
      if (event.status === "Published") {
        await api.post(
          `/event/${event.id}/unpublish`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast("success", "Event unpublished.");
      } else {
        await api.post(
          `/event/${event.id}/publish`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast("success", "Event Published");
      }
      fetchEvents();
    } catch (e) {
      console.error(e);
      showToast("error", `${e.response?.data?.message || "Event published."}`);
    }
  };

  return (
    <DashboardLayout>
      <section className="mx-auto max-w-6xl  space-y-6">
        <h1 className="text-2xl font-extrabold text-white">All Events</h1>

        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center text-white/70">
            Loading events…
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
            No events found.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 h-screen overflow-y-scroll scrollbar-hide ">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-36 w-full overflow-hidden rounded-lg border border-white/10 bg-black/40">
                  <img
                    src={
                      ev.imageUrl ||
                      "https://res.cloudinary.com/dbpjskran/image/upload/v1754989530/event_nrufbc.jpg"
                    }
                    alt="image"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="mt-4 flex-1">
                  <h3 className="text-lg font-bold text-white line-clamp-1">
                    {ev.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/60 line-clamp-2">
                    {ev.description}
                  </p>
                  <div className="mt-2 text-xs text-white/60">
                    {formatDate(ev.startDate)} → {formatDate(ev.endDate)}
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        ev.status === "Published"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-white/10 text-white/70"
                      }`}
                    >
                      {ev.status || "Draft"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/admin-event/${ev.id}`}
                    className="flex-1 rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-sm text-yellow-300 hover:bg-yellow-400/20 text-center"
                  >
                    See more
                  </Link>
                  <button
                    onClick={() => togglePublish(ev)}
                    className="flex-1 cursor-pointer rounded-lg border border-pink-500/40 bg-pink-500/10 px-3 py-1.5 text-sm text-pink-300 hover:bg-pink-500/20"
                  >
                    {ev.status === "Published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => deleteEvent(ev.id)}
                    className="flex-1 rounded-lg border cursor-pointer border-red-500/40 bg-red-500/10 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: "", message: "" })}
        />
      </section>
    </DashboardLayout>
  );
}
