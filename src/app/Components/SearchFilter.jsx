"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const defaultCities = ["Lagos", "Abuja", "Port Harcourt", "Ibadan"];
const defaultCats = [
  "Music",
  "Tech",
  "Comedy",
  "Sports",
  "Theatre",
  "Festival",
  "Faith",
  "Family",
];

export default function SearchFilters({
  className = "",
  cities = defaultCities,
  categories = defaultCats,
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("Lagos");
  const [dateQuick, setDateQuick] = useState("any"); // "today" | "tomorrow" | "weekend" | "any"
  const [pickedCats, setPickedCats] = useState([]);
  const [price, setPrice] = useState(50000);

  function toggleCat(c) {
    setPickedCats((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function onSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams({
      q,
      city,
      date: dateQuick,
      maxPrice: String(price),
      cats: pickedCats.join(","),
    });
    router.push(`/events?${params.toString()}`);
  }

  return (
    <section
      className={`relative mx-auto mt-14 max-w-7xl px-4 sm:px-6 ${className}`}
      aria-label="Search events"
    >
      <div
        className="pointer-events-none absolute -top-16 h-40 blur-2xl"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(147,51,234,.25), rgba(0,0,0,0))",
        }}
      />
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-yellow-400/30 bg-white/5 backdrop-blur-md shadow-xl ring-1 ring-white/10"
      >
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <label className="mb-2 block text-sm font-medium text-white/80">
              Search
            </label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Artist, event, or venue"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-pink-500/60"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="mb-2 block text-sm font-medium text-white/80">
              Location
            </label>
            <div className="relative">
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
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
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

          <div className="lg:col-span-4">
            <span className="mb-2 block text-sm font-medium text-white/80">
              When
            </span>
            <div className="flex flex-wrap gap-2">
              {["today", "tomorrow", "weekend", "any"].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setDateQuick(k)}
                  className={`rounded-full px-4 py-2 text-sm capitalize transition ${
                    dateQuick === k
                      ? "bg-yellow-400 text-black"
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-sm font-medium text-white/80">Categories</p>
            <div className="flex max-w-full flex-wrap gap-2">
              {categories.map((c) => {
                const active = pickedCats.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCat(c)}
                    className={`rounded-full px-3 py-1.5 text-sm transition ${
                      active
                        ? "bg-pink-600 text-white ring-2 ring-pink-300/40"
                        : "bg-white/5 text-white/80 hover:bg-white/10 border border-white/10"
                    }`}
                    aria-pressed={active}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 lg:ml-auto">
            <label
              htmlFor="price"
              className="whitespace-nowrap text-sm text-white/80"
            >
              Max ₦{price.toLocaleString()}
            </label>
            <input
              id="price"
              type="range"
              min={1000}
              max={250000}
              step={1000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="h-2 w-48 cursor-pointer appearance-none rounded bg-white/10 accent-pink-600"
            />
          </div>

          <button
            type="submit"
            className="group cursor-pointer relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:brightness-110"
          >
            <span className="absolute  inset-0 -z-10 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-pink-600 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-60" />
            Search events
          </button>
        </div>
      </form>
    </section>
  );
}
