"use client";

import { useState } from "react";

export default function NotifySignup({
  cities = ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
}) {
  const [channel, setChannel] = useState("email"); // "email" | "whatsapp"
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+234");
  const [city, setCity] = useState(cities[0]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // {type:"success"|"error", text:string}

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);

    if (channel === "email" && !/^\S+@\S+\.\S+$/.test(email)) {
      setMsg({ type: "error", text: "Enter a valid email address." });
      return;
    }
    if (
      channel === "whatsapp" &&
      !/^\+?\d{9,15}$/.test(phone.replace(/\s/g, ""))
    ) {
      setMsg({
        type: "error",
        text: "Enter a valid WhatsApp number (e.g., +2348012345678).",
      });
      return;
    }

    setLoading(true);
    try {
      // Replace with your real endpoint
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          email: channel === "email" ? email : undefined,
          phone: channel === "whatsapp" ? phone : undefined,
          city,
          source: "homepage",
        }),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      setMsg({
        type: "success",
        text: "You’re in! We’ll send drops & presales for your city.",
      });
      setEmail("");
      setPhone("+234");
    } catch (err) {
      setMsg({
        type: "error",
        text: "Couldn’t subscribe. Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="relative mx-auto mt-16 max-w-3xl px-4 sm:px-6"
      aria-label="Get updates"
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[70vw] -translate-x-1/2 blur-2xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(147,51,234,.25), rgba(0,0,0,0))",
        }}
      />
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-white">
            Get city-specific drops & presales
          </h2>
          <p className="mt-1 text-sm text-white/70">
            No spam. Unsubscribe anytime.
          </p>
        </div>

        {/* Channel toggle */}
        <div
          role="tablist"
          aria-label="Notification channel"
          className="relative mx-auto mb-5 grid w-full max-w-xs grid-cols-2 rounded-full border border-white/10 bg-white/5 p-1"
        >
          {["email", "whatsapp"].map((c) => {
            const selected = c === channel;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={selected}
                onClick={() => setChannel(c)}
                className={`relative z-10 rounded-full px-4 py-2 text-sm font-medium transition ${
                  selected ? "text-black" : "text-white/80 hover:text-white"
                }`}
              >
                {c === "email" ? "Email" : "WhatsApp"}
              </button>
            );
          })}
          <div
            className={`absolute inset-y-1 w-1/2 rounded-full bg-yellow-400 transition-transform duration-300`}
            style={{
              transform:
                channel === "email" ? "translateX(0%)" : "translateX(100%)",
            }}
            aria-hidden
          />
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="grid gap-4 sm:grid-cols-[1fr_auto]"
        >
          {/* Input group */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <label className="mb-2 block text-xs font-medium text-white/70">
                {channel === "email" ? "Email address" : "WhatsApp number"}
              </label>
              {channel === "email" ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-pink-500/60"
                  aria-label="Email"
                />
              ) : (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+2348012345678"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-pink-500/60"
                  aria-label="WhatsApp number"
                />
              )}
            </div>

            <div className="relative">
              <label className="mb-2 block text-xs font-medium text-white/70">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 pr-10 text-white outline-none focus:border-yellow-400/60"
                aria-label="Select city"
              >
                {cities.map((c) => (
                  <option key={c} value={c} className="bg-black">
                    {c}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-[42px]"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M7 10l5 5 5-5"
                  stroke="#FACC15"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group inline-flex items-center justify-center rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            <span className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-pink-600 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-60" />
            {loading
              ? "Please wait…"
              : channel === "email"
              ? "Get updates"
              : "Notify me on WhatsApp"}
          </button>
        </form>

        {/* Terms + message */}
        <div className="mt-3 text-center text-xs text-white/50">
          By subscribing you agree to our{" "}
          <a
            href="/terms"
            className="underline decoration-white/30 hover:decoration-white"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="underline decoration-white/30 hover:decoration-white"
          >
            Privacy
          </a>
          .
        </div>

        {msg && (
          <div
            className={`mt-3 rounded-xl border px-4 py-3 text-sm ${
              msg.type === "success"
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                : "border-red-400/30 bg-red-500/10 text-red-200"
            }`}
            role="status"
          >
            {msg.text}
          </div>
        )}
      </div>
    </section>
  );
}
