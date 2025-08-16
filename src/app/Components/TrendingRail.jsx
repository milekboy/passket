"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export default function TrendingRail({ events = [] }) {
  // Duplicate for seamless loop
  const data = useMemo(
    () => (events.length ? [...events, ...events] : []),
    [events]
  );

  const trackRef = useRef(null);
  const [duration, setDuration] = useState(30); // seconds
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia) {
      const m = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduceMotion(m.matches);
      const onChange = (e) => setReduceMotion(e.matches);
      m.addEventListener?.("change", onChange);
      return () => m.removeEventListener?.("change", onChange);
    }
  }, []);

  // Calculate duration so speed is consistent across widths
  useEffect(() => {
    const calc = () => {
      const el = trackRef.current;
      if (!el) return;
      const halfWidth = el.scrollWidth / 2; // items are doubled
      const PX_PER_SEC = 80; // tweak speed (60–120 good range)
      const d = Math.max(10, Math.round(halfWidth / PX_PER_SEC));
      setDuration(d);
    };
    calc();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", calc);
      return () => window.removeEventListener("resize", calc);
    }
  }, [data]);

  if (!events.length) return null;

  return (
    <section className="relative mx-auto mt-14 max-w-7xl px-4 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          🔥 Trending Now
        </h2>
        <Link
          href="/events"
          className="rounded-full border border-yellow-400/40 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
        >
          See more
        </Link>
      </div>

      {/* edge fades */}
      <div className="pointer-events-none absolute left-0 top-20 bottom-4 w-20 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute right-0 top-20 bottom-4 w-20 bg-gradient-to-l from-black to-transparent" />

      {/* marquee track */}
      <div
        className="overflow-hidden pb-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          className="flex gap-5 will-change-transform"
          style={{
            // Use LONGHANDS only (no 'animation' shorthand) to avoid the React warning
            animationName: reduceMotion ? "none" : "marquee",
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {data.map((ev, i) => (
            <article
              key={`${ev.id}-${i}`}
              className="group relative w-[280px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 transition group-hover:ring-pink-500/60" />
              <div className="relative h-44 w-full">
                <Image
                  src={ev.image}
                  alt={`${ev.title} poster`}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
                {ev.badge && (
                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs ${
                      ev.badge === "Sold out"
                        ? "bg-white/10 text-white border border-white/20"
                        : "bg-yellow-400 text-black"
                    }`}
                  >
                    {ev.badge}
                  </span>
                )}
              </div>

              <div className="space-y-2 p-4">
                <h3 className="line-clamp-2 text-base font-semibold text-white">
                  {ev.title}
                </h3>
                <p className="text-sm text-white/70">{ev.date}</p>
                <p className="text-sm text-white/60">{ev.venue}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-white/80">
                    From{" "}
                    <span className="font-semibold text-white">
                      ₦{Number(ev.priceFrom).toLocaleString()}
                    </span>
                  </span>
                  <Link
                    href={`/events/${ev.id}`}
                    className="rounded-lg bg-pink-600 px-3 py-1.5 text-sm font-medium text-white hover:brightness-110"
                  >
                    Get Tickets
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          } /* move by half since items are doubled */
        }
      `}</style>
    </section>
  );
}
