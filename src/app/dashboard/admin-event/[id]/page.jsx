"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "../../DashboardLayout";
import NetworkInstance from "../../../Components/NetworkInstance";
import Toast from "../../../Components/Toast";
import { useAuth } from "@/app/Components/AuthContext";

/* Utils */
const fmtNaira = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
const toISOZ = (local) => (local ? new Date(local).toISOString() : null);
const fmtMoney = (n, c = "NGN") =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: c }).format(n);
const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    const df = new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return df.format(d);
  } catch {
    return iso;
  }
};

export default function EventDetailPage() {
  const { id } = useParams(); // /dashboard/events/[id]
  const router = useRouter();
  const api = NetworkInstance();
  const { token, logout } = useAuth();
  const [tab, setTab] = useState("overview"); // "overview" | "tickets" | "publish"
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => setToast({ type, message });

  // --- Fetch event & tickets ---
  const fetchAll = async () => {
    try {
      setLoading(true);

      // Fetch all events owned by the organizer
      const evRes = await api.get("/Event/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("mine:", evRes?.data);
      console.log("route id:", id);

      const list =
        evRes?.data?.events ??
        evRes?.data?.data ??
        (Array.isArray(evRes?.data) ? evRes.data : []) ??
        [];

      // Find the event that matches the route param [id]
      const found = Array.isArray(list)
        ? list.find((e) => e.id === id)
        : list?.id === id
        ? list
        : null;

      if (!found) {
        setEvent(null);
        setTickets([]);
        showToast("error", "Event not found among your events.");
        return;
      }

      setEvent(found);
      console.log("found event:", found);
      // Map ticketTiers → UI tickets shape used elsewhere in the page
      const mappedTickets = (found.ticketTiers ?? []).map((t) => ({
        id: t.id,
        name: t.name ?? t.title ?? "Ticket",
        price: Number(t.price ?? t.amount ?? t.unitPrice ?? 0),
        qtyAvailable: t.qtyAvailable ?? t.quantityAvailable ?? t.quantity ?? 0,
        maxPerOrder: t.maxPerOrder ?? t.maxPurchaseLimit ?? null,
        subtitle: t.subtitle ?? "",
        badge: t.badge ?? "",
      }));

      setTickets(mappedTickets);
      console.log(tickets);
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to load event.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const hasTickets = tickets && tickets.length > 0;
  const isPublished = event?.status === "Published";

  if (loading) {
    return (
      <DashboardLayout>
        <section className="flex min-h-[60vh] items-center justify-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white/80">
            Loading event…
          </div>
        </section>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <section className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-red-200">
            Event not found.
          </div>
        </section>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              {event.title}
            </h1>
            <p className="text-sm text-white/60">
              {event.location || "—"} •{" "}
              {event.startDate ? formatDate(event.startDate) : "—"}
              {event.endDate ? ` – ${formatDate(event.endDate)}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                isPublished
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-white/10 text-white/70"
              }`}
            >
              {isPublished ? "Published" : "Draft"}
            </span>
            <Link
              href="/dashboard/events"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
            >
              Back to Events
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          <TabButton
            active={tab === "overview"}
            onClick={() => setTab("overview")}
          >
            Overview
          </TabButton>
          <TabButton
            active={tab === "tickets"}
            onClick={() => setTab("tickets")}
          >
            Tickets
          </TabButton>
          <TabButton
            active={tab === "publish"}
            onClick={() => setTab("publish")}
            disabled={!hasTickets}
            title={
              !hasTickets ? "Add at least one ticket to publish" : undefined
            }
          >
            Publish
          </TabButton>
        </div>

        {/* Panels */}
        {tab === "overview" && (
          <OverviewPanel event={event} tickets={tickets} />
        )}

        {tab === "tickets" && (
          <TicketsPanel
            eventId={id}
            tickets={tickets}
            onChanged={async (msg) => {
              await fetchAll();
              if (msg) showToast("success", msg);
            }}
            onError={(msg) => showToast("error", msg)}
          />
        )}

        {tab === "publish" && (
          <PublishPanel
            event={event}
            tickets={tickets}
            onPublished={async () => {
              showToast("success", "Event published!");
              await fetchAll();
              setTab("overview");
            }}
            onError={(msg) => showToast("error", msg)}
          />
        )}
      </section>

      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />
    </DashboardLayout>
  );
}

/* --------------------------- Sub-components --------------------------- */

function TabButton({ active, onClick, children, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`cursor-pointer rounded-xl border px-4 py-2 text-sm transition ${
        active
          ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-300"
          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

/* Overview */
function OverviewPanel({ event, tickets }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      {/* Left: Event card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative h-36 w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 sm:w-56">
            <img
              src="https://res.cloudinary.com/dbpjskran/image/upload/v1754989530/event_nrufbc.jpg"
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-white">{event.title}</h3>
            <p className="mt-1 text-sm text-white/70 line-clamp-3">
              {event.description}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-white/80 sm:grid-cols-3">
              <Meta
                label="Start"
                value={event.startDate ? formatDate(event.startDate) : "—"}
              />
              <Meta
                label="End"
                value={event.endDate ? formatDate(event.endDate) : "—"}
              />
              <Meta label="Location" value={event.location || "—"} />
              <Meta label="Category" value={event.category || "—"} />
              <Meta label="Tickets" value={tickets?.length || 0} />
              <Meta label="Status" value={event.status || "Draft"} />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Quick tips */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h4 className="text-white font-semibold">Next steps</h4>
        <ul className="mt-3 list-disc pl-4 text-sm text-white/70 space-y-1">
          <li>Add at least one ticket type (Regular, VIP, Early Bird…)</li>
          <li>Double-check date, venue, and image</li>
          <li>Publish when you’re ready — event goes live instantly</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const btn = document.getElementById("tab-tickets-btn");
              btn?.click();
            }}
            className="rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-sm text-yellow-300 hover:bg-yellow-400/20"
          >
            Create tickets
          </Link>
          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70">
            Publish is locked until tickets exist
          </span>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-white/50">
        {label}
      </div>
      <div className="text-white">{value}</div>
    </div>
  );
}

function TicketsPanel({ eventId, tickets, onChanged, onError }) {
  const api = NetworkInstance();
  const { token } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    currency: "NGN",
    maxQuantity: "",
    isAvailable: true,
    saleStartLocal: "",
    saleEndLocal: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addTicket = async (e) => {
    e.preventDefault();
    if (!form.name) return onError?.("Ticket name is required.");
    if (form.price === "" || Number.isNaN(Number(form.price)))
      return onError?.("Enter a valid price (0 for free).");
    if (form.maxQuantity === "" || Number.isNaN(Number(form.maxQuantity)))
      return onError?.("Enter a valid max quantity.");

    try {
      setSaving(true);

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        currency: form.currency || "NGN",
        maxQuantity: Number(form.maxQuantity),
        isAvailable: true,
        saleStartDate: toISOZ(form.saleStartLocal),
        saleEndDate: toISOZ(form.saleEndLocal),
      };

      await api.post(`/events/${eventId}/ticket-tiers`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        name: "",
        description: "",
        price: "",
        currency: "NGN",
        maxQuantity: "",
        isAvailable: true,
        saleStartLocal: "",
        saleEndLocal: "",
      });

      onChanged?.("Ticket added.");
    } catch (e) {
      console.error(e);
      onError?.(e?.response?.data?.error || "Failed to add ticket.");
    } finally {
      setSaving(false);
    }
  };

  const removeTicket = async (ticketId) => {
    if (!confirm("Delete this ticket?")) return;
    try {
      await api.delete(`/events/${eventId}/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onChanged?.("Ticket deleted.");
    } catch (e) {
      console.error(e);
      onError?.("Failed to delete ticket.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      {/* Add ticket form */}
      <form
        onSubmit={addTicket}
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h3 className="text-lg font-semibold text-white">Create a ticket</h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-white/80">
              Ticket name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-white/80">
              Description
            </label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">
              Price
            </label>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">
              Currency
            </label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
            >
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
              <option value="GHS">GHS</option>
              <option value="KES">KES</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">
              Max quantity
            </label>
            <input
              name="maxQuantity"
              type="number"
              min="0"
              value={form.maxQuantity}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isAvailable"
              name="isAvailable"
              type="checkbox"
              checked={form.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 accent-yellow-400"
            />
            <label htmlFor="isAvailable" className="text-sm text-white/80">
              Available for sale
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">
              Sale starts
            </label>
            <input
              name="saleStartLocal"
              type="datetime-local"
              value={form.saleStartLocal}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">
              Sale ends
            </label>
            <input
              name="saleEndLocal"
              type="datetime-local"
              value={form.saleEndLocal}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-5 w-full cursor-pointer rounded-lg bg-pink-600 px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-50"
        >
          {saving ? "Adding…" : "Add ticket"}
        </button>
      </form>

      {/* Ticket list */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">Tickets</h3>
        <div className="mt-3 space-y-3">
          {tickets?.length ? (
            tickets.map((t) => (
              <div
                key={t.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-white">{t.name}</div>
                  </div>

                  <div className="mt-1 text-sm text-white/70">
                    {t.description}
                  </div>

                  <div className="mt-1 text-sm text-white/80">
                    {fmtMoney(Number(t.price ?? 0), t.currency || "NGN")} •
                    <span className="ml-1">Max {t.soldQuantity}</span>
                  </div>
                </div>

                <div className="shrink-0 flex gap-2">
                  <button
                    onClick={() => removeTicket(t.id)}
                    className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-white/10 bg-black/30 p-4 text-sm text-white/70">
              No tickets yet. Use the form to create your first ticket.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Publish */
function PublishPanel({ event, tickets, onPublished, onError }) {
  const api = NetworkInstance();
  const [confirm, setConfirm] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const canPublish = tickets && tickets.length > 0;

  const doPublish = async () => {
    if (!canPublish) return onError?.("Add at least one ticket first.");
    if (!confirm) return onError?.("Please confirm details are correct.");

    try {
      setPublishing(true);
      // Use your actual publish endpoint; adjust method as needed (POST/PATCH)
      await api.post(`/events/${event.id}/publish`);
      onPublished?.();
    } catch (e) {
      console.error(e);
      onError?.(e.response.data.error || "Failed to publish event.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      {/* Preview */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">Preview</h3>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <div className="relative h-36 w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 sm:w-56">
            {event.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.imageUrl}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/50">
                No image
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="text-white font-semibold">{event.title}</div>
            <div className="text-sm text-white/70 mt-1">
              {event.location || "—"}
            </div>
            <div className="text-sm text-white/70">
              {event.startDate ? formatDate(event.startDate) : "—"}
            </div>

            <div className="mt-3">
              <div className="text-[11px] uppercase tracking-wide text-white/50">
                Tickets
              </div>
              <ul className="mt-1 space-y-1 text-sm text-white/80">
                {tickets.map((t) => (
                  <li key={t.id}>
                    {t.name} — {t.price > 0 ? fmtNaira(t.price) : "Free"} (
                    {t.qtyAvailable} available)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {!canPublish && (
          <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
            You must add at least one ticket before publishing this event.
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">Publish</h3>
        <p className="mt-1 text-sm text-white/70">
          Once published, your event will be live and visible to attendees. You
          can still edit details later.
        </p>

        <label className="mt-4 flex items-start gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={confirm}
            onChange={(e) => setConfirm(e.target.checked)}
            className="mt-1 h-4 w-4 accent-yellow-400"
          />
          <span>
            I confirm all event details and ticket information are correct.
          </span>
        </label>

        <button
          onClick={doPublish}
          disabled={!canPublish || publishing || !confirm}
          className="mt-4 w-full cursor-pointer rounded-lg bg-gradient-to-r from-pink-600 via-yellow-400 to-pink-600 px-4 py-2 font-semibold text-black shadow-md transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {publishing ? "Publishing…" : "Publish now"}
        </button>

        <p className="mt-2 text-xs text-white/50">
          You can unpublish from the Events list if needed.
        </p>
      </div>
    </div>
  );
}
