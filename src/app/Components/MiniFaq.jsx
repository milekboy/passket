"use client";

import { useState, useRef, useEffect } from "react";

export default function FAQTabs() {
  const TABS = ["Attendees", "Organisers"];
  const [active, setActive] = useState("Attendees");
  const tablistRef = useRef(null);

  const attendees = [
    {
      q: "What payment methods do you accept?",
      a: "Cards and bank transfer via Paystack/Flutterwave. Confirmation is instant.",
    },
    {
      q: "My payment failed — what should I do?",
      a: "Try again or switch method. If you were charged without a ticket, your bank typically auto-reverses in 24–48h. You’ll also get an email update.",
    },
    {
      q: "How do refunds work?",
      a: "If an event is cancelled or postponed, you’ll be notified by email and a refund will be processed to your original payment method.",
    },
    {
      q: "Do I need to print my ticket?",
      a: "No printing needed. Show the QR on your phone at the gate. Turn up screen brightness for faster scanning.",
    },
  ];

  const organisers = [
    {
      q: "How do I list an event?",
      a: "Create an organiser account, go to Dashboard → Events → New Event. Add ticket types, prices and capacity, then click ‘Go Live’.",
    },
    {
      q: "When do I get paid?",
      a: "Standard settlement is T+1 to your verified bank account. You can also request manual payout after each event if enabled.",
    },
    {
      q: "What are your fees?",
      a: "MVP pricing is a simple per-transaction fee. For high volume, contact sales for custom rates and seat-licence options.",
    },
    {
      q: "How do you prevent fake tickets?",
      a: "Each ticket carries a secure QR code verified at the gate. Once scanned/used, it can’t be reused. Staff can also check-in offline and sync later.",
    },
    {
      q: "Can my team have separate logins and permissions?",
      a: "Yes. Add staff to your organisation and assign roles (e.g., Finance, Ops, Marketing) to control access.",
    },
    {
      q: "What do you need for KYC/settlement?",
      a: "A valid business/creator profile, bank details, and basic identity documents. This helps us keep payouts fast and fraud low.",
    },
  ];

  // Basic keyboard support: left/right arrows to switch tabs
  useEffect(() => {
    const el = tablistRef.current;
    if (!el) return;
    const onKey = (e) => {
      const idx = TABS.indexOf(active);
      if (e.key === "ArrowRight") setActive(TABS[(idx + 1) % TABS.length]);
      if (e.key === "ArrowLeft")
        setActive(TABS[(idx - 1 + TABS.length) % TABS.length]);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [active]);

  const list = active === "Attendees" ? attendees : organisers;

  return (
    <section className="mx-auto mt-16 mb-20 max-w-7xl px-4 sm:px-6">
      <h2 className="mb-6 text-center text-2xl font-bold text-white">FAQs</h2>

      {/* Tabs */}
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="FAQ tabs"
        className="relative mx-auto mb-6 grid w-full max-w-lg grid-cols-2 rounded-full border border-white/10 bg-white/5 p-1"
      >
        {TABS.map((label) => {
          const selected = active === label;
          return (
            <button
              key={label}
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${label}`}
              id={`tab-${label}`}
              onClick={() => setActive(label)}
              className={`relative z-10 rounded-full cursor-pointer px-4 py-2 text-sm font-medium transition ${
                selected ? "text-black" : "text-white/80 hover:text-white"
              }`}
            >
              {label}
            </button>
          );
        })}
        {/* animated pill */}
        <div
          className={`absolute  inset-y-1 w-1/2 rounded-full bg-yellow-400 transition-transform duration-300`}
          style={{
            transform:
              active === "Attendees" ? "translateX(0%)" : "translateX(100%)",
          }}
          aria-hidden
        />
      </div>

      {/* Panels */}
      <div
        id={`panel-${active}`}
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5"
      >
        {list.map(({ q, a }) => (
          <details key={q} className="group">
            <summary className="cursor-pointer list-none px-5 py-4 text-white hover:bg-white/5">
              <span className="mr-2 text-yellow-300">?</span>
              {q}
            </summary>
            <div className="px-5 pb-5 text-white/70">{a}</div>
          </details>
        ))}
      </div>

      {/* Optional small print */}
      <p className="mt-4 text-center text-xs text-white/50">
        For more help, visit our Help Center or contact support.
      </p>
    </section>
  );
}
