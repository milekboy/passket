"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* Utils */
const fmtNaira = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

const formatDateRange = (startISO, endISO) => {
  try {
    const s = new Date(startISO);
    const e = endISO ? new Date(endISO) : null;
    const dateFmt = new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const timeFmt = new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    if (!e) return `${dateFmt.format(s)} • ${timeFmt.format(s)}`;
    const sameDay =
      s.getFullYear() === e.getFullYear() &&
      s.getMonth() === e.getMonth() &&
      s.getDate() === e.getDate();
    return sameDay
      ? `${dateFmt.format(s)} • ${timeFmt.format(s)} – ${timeFmt.format(e)}`
      : `${dateFmt.format(s)} ${timeFmt.format(s)} → ${dateFmt.format(
          e
        )} ${timeFmt.format(e)}`;
  } catch {
    return startISO;
  }
};

function TicketRow({ t, qty, onChange }) {
  // Sold out only if organiser explicitly sets qtyAvailable to 0 or less
  const soldOut = t.availableQuantity !== undefined && t.availableQuantity <= 0;
  // No per-order limit: cap only by available inventory (or infinity if not provided)
  const max = t.availableQuantity ?? Infinity;

  return (
    <div
      className={`rounded-xl border bg-white/5 p-4 transition ${
        soldOut
          ? "border-white/10 opacity-60"
          : "border-white/10 hover:bg-white/10"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-base font-semibold text-white">
              {t.name}
            </h4>
            {/* {t.description && (
              <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-semibold text-black">
                {t.description}
              </span>
            )} */}
          </div>
          {t.description && (
            <p className="mt-1 text-sm text-white/70">{t.description}</p>
          )}
          <p className="mt-2 text-sm text-white/60">
            {soldOut
              ? "Sold out"
              : `${fmtNaira(t.price)} • ${t.access || "Admit one"}`}
          </p>
        </div>

        <div className="shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease"
              onClick={() => onChange(Math.max(0, qty - 1))}
              disabled={soldOut || qty <= 0}
              className="h-9 w-9 cursor-pointer rounded-lg border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              –
            </button>
            <div className="min-w-[2ch] text-center text-white">{qty}</div>
            <button
              type="button"
              aria-label="Increase"
              onClick={() => onChange(Math.min(max, qty + 1))}
              disabled={soldOut || qty >= max}
              className="h-9 w-9 cursor-pointer rounded-lg border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          {/* Removed the "Max X/order" note */}
        </div>
      </div>
    </div>
  );
}

export default function EventDetailMain({
  event = {
    id: "",
    title: "",
    coverImage: "",
    startDate: "",
    endDate: null,
    venueName: "",
    address: "",
    city: "",
    organiserName: "",
    descriptionHtml: "",
    categories: [],
    tickets: [],
  },
  onBeginCheckout, // optional callback(selection, total)
}) {
  const router = useRouter();

  // selection state { [ticketId]: qty }
  const [sel, setSel] = useState({});
  useEffect(() => {
    if (!event?.id) return;
    const key = `checkout:${event.id}`;
    try {
      const saved = sessionStorage.getItem(key);
      if (saved) {
        const { selection } = JSON.parse(saved);
        if (selection) setSel(selection);
      }
    } catch {}
  }, [event?.id]);

  // ---- FEES: 5% of price + ₦100 per PAID ticket ----
  const { ticketSubtotal, count, countPaid, fees, grandTotal, lines } =
    useMemo(() => {
      let ticketSubtotal = 0;
      let count = 0;
      let countPaid = 0;
      const lines = [];
      for (const t of event.ticketTiers || []) {
        const q = sel[t.id] || 0;
        if (q > 0) {
          count += q;
          const isPaid = (t.price || 0) > 0;
          if (isPaid) {
            ticketSubtotal += t.price * q;
            countPaid += q;
          }
          lines.push({
            id: t.id,
            name: t.name,
            qty: q,
            unit: t.price,
            subtotal: t.price * q,
          });
        }
      }
      // per-ticket fee = round(5% of unit price + 100)
      const perTicketFee = (unit) => Math.round(unit * 0.05 + 100);
      const fees = (event.ticketTiers || []).reduce((acc, t) => {
        const q = sel[t.id] || 0;
        if (q > 0 && (t.price || 0) > 0) acc += perTicketFee(t.price) * q;
        return acc;
      }, 0);
      const grandTotal = ticketSubtotal + fees;
      return { ticketSubtotal, count, countPaid, fees, grandTotal, lines };
    }, [sel, event.tickets]);

  const allSoldOut = (event.ticketTiers || []).every(
    (t) => (t.availableQuantity ?? 0) <= 0
  );
  const handleChange = (id, v) => setSel((s) => ({ ...s, [id]: v }));

  const beginCheckout = () => {
    const payload = {
      eventId: event.id,
      eventTitle: event.title,
      venueName: event.venueName,
      startsAt: event.startDate,
      selection: sel,
      lines,
      ticketSubtotal,
      fees,
      grandTotal,
      currency: "NGN",
      feeFormula: "5% + ₦100 per paid ticket",
      countPaid,
    };
    try {
      sessionStorage.setItem(`checkout:${event.id}`, JSON.stringify(payload));
    } catch {}
    if (typeof onBeginCheckout === "function")
      onBeginCheckout(payload, grandTotal);
    else router.push(`/checkout/${event.id}`);
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          url: typeof window !== "undefined" ? window.location.href : "",
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied!");
      }
    } catch {}
  };

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* top layout */}
      <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
        {/* LEFT — media + meta + description */}
        <div>
          {/* Cover / poster */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <Image
              src={
                event.imageUrl ||
                "https://res.cloudinary.com/dbpjskran/image/upload/v1754989530/event_nrufbc.jpg"
              }
              alt="event cover image"
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Meta cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <MetaCard
              label="Date & Time"
              value={formatDateRange(event.startDate, event.endDate)}
              icon={<CalendarIcon />}
            />
            <MetaCard
              label="Venue"
              value={
                <span>
                  {event.location}
                  {event.city ? `, ${event.city}` : ""}
                  {event.address ? (
                    <span className="block text-white/50">{event.address}</span>
                  ) : null}
                </span>
              }
              icon={<PinIcon />}
            />
            <MetaCard
              label="Organiser"
              value={event.organiserName || "—"}
              icon={<UserIcon />}
            />
          </div>

          {/* Share + policy strip */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/60">
            {/* Animated Share button */}
            <button
              onClick={share}
              className="btn-share group relative overflow-hidden rounded-full border border-yellow-300/40 bg-white/5 px-4 py-1.5 text-white cursor-pointer hover:bg-white/10"
            >
              <span className="relative z-10 flex items-center gap-2">
                <ShareIcon />
                Share
              </span>
              {/* shine sweep */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shine" />
            </button>

            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
              Secure checkout
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
              Refunds for cancelled shows
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
              NDPA/NDPC compliant
            </span>
          </div>

          {/* About / description */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              About this event
            </h3>
            {event.description ? (
              <article
                className="prose prose-invert prose-p:leading-relaxed prose-a:text-yellow-300"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            ) : (
              <p className="text-white/70">No description provided yet.</p>
            )}
          </div>
        </div>

        {/* RIGHT — ticket selector & order summary */}
        <aside className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Tickets</h3>
              {allSoldOut && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
                  All sold out
                </span>
              )}
            </div>

            <div className="space-y-3">
              {(event.ticketTiers || []).map((t) => (
                <TicketRow
                  key={t.id}
                  t={t}
                  qty={sel[t.id] || 0}
                  onChange={(v) => handleChange(t.id, v)}
                />
              ))}
            </div>

            {/* summary */}
            <div className="mt-5 border-t border-white/10 pt-4 space-y-2">
              <div className="flex items-center justify-between pt-2 text-sm font-semibold text-white">
                <span>Total</span>
                <span>{fmtNaira(grandTotal)}</span>
              </div>

              <p className="text-[12px] text-white/50">
                Fees apply only to paid tickets. Free tickets incur no fees.
              </p>

              <button
                onClick={beginCheckout}
                disabled={count === 0}
                className="group relative mt-2 w-full cursor-pointer rounded-xl bg-pink-600 px-5 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-pink-600 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-60" />
                {count === 0 ? "Select tickets" : "Proceed to checkout"}
              </button>
            </div>
          </div>
          {/* <div className="mt-5 border-t border-white/10 pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Tickets</span>
              <span>{fmtNaira(ticketSubtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Fees</span>
              <span>{fmtNaira(fees)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 text-sm font-semibold text-white">
              <span>Total</span>
              <span>{fmtNaira(grandTotal)}</span>
            </div>
          </div> */}

          {/* small info card */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
            <p className="flex items-center gap-2">
              <ShieldIcon /> Your tickets will be delivered instantly via email.
            </p>
            <p className="mt-2 flex items-center gap-2">
              <QrIcon /> Show the QR at the gate—no printing needed.
            </p>
          </div>
        </aside>
      </div>

      {/* Sticky mobile checkout bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-black/70 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="text-sm text-white/80">
            <span className="font-semibold text-white">
              {fmtNaira(grandTotal)}
            </span>{" "}
            <span className="text-white/60">
              • {count} {count === 1 ? "ticket" : "tickets"}
            </span>
          </div>
          <button
            onClick={beginCheckout}
            disabled={count === 0}
            className="cursor-pointer rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {count === 0 ? "Select tickets" : "Checkout"}
          </button>
        </div>
      </div>

      {/* animated Share styles */}
      <style jsx>{`
        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.25);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(250, 204, 21, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(250, 204, 21, 0);
          }
        }
        @keyframes shine {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }
        .btn-share {
          animation: pulseGlow 3s ease-in-out infinite;
        }
        .group:hover .btn-share {
          animation-duration: 2.4s;
        }
        .group:hover .animate-shine {
          animation: shine 0.8s linear 1;
        }
      `}</style>
    </section>
  );
}

/* Small sub-components */

function MetaCard({ label, value, icon, right }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] uppercase tracking-wide text-white/50">
            {label}
          </div>
          {right}
        </div>
        <div className="mt-1 text-sm text-white">{value}</div>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
        stroke="#fff"
        strokeOpacity=".7"
        strokeWidth="1.5"
      />
      <path d="M3 9h18" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
      <path
        d="M8 2v4M16 2v4"
        stroke="#FACC15"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s7-5.1 7-11a7 7 0 10-14 0c0 5.9 7 11 7 11z"
        stroke="#fff"
        strokeOpacity=".7"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="2.5" stroke="#FACC15" strokeWidth="1.5" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="#fff"
        strokeOpacity=".7"
        strokeWidth="1.5"
      />
      <path
        d="M4 20c2.5-3 5-4.5 8-4.5S17.5 17 20 20"
        stroke="#fff"
        strokeOpacity=".7"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7l8-4z"
        stroke="#fff"
        strokeOpacity=".7"
        strokeWidth="1.5"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function QrIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3H5a2 2 0 00-2 2v2M17 3h2a2 2 0 012 2v2M7 21H5a2 2 0 01-2-2v-2M17 21h2a2 2 0 002-2v-2"
        stroke="#fff"
        strokeOpacity=".7"
        strokeWidth="1.5"
      />
      <path d="M8 11h8M8 15h8" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 8a3 3 0 10-2.83-3.99M6 14a3 3 0 102.83 3.99M18 8l-9 5M18 8l-9-5M9 19l9-5"
        stroke="#FACC15"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
