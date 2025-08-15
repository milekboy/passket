"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function TrendingRail({ events = [] }) {
  const scroller = useRef(null);

  const scrollByCards = (dir) => {
    const el = scroller.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative mx-auto mt-14 max-w-7xl px-4 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          🔥 Trending near you
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scrollByCards("left")}
            className="rounded-full border border-white/20 bg-white/5 p-2 text-white hover:bg-white/10"
          >
            <ArrowLeft />
          </button>
          <button
            onClick={() => scrollByCards("right")}
            className="rounded-full border border-white/20 bg-white/5 p-2 text-white hover:bg-white/10"
          >
            <ArrowRight />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 top-20 bottom-4 w-20 bg-gradient-to-r from-black to-transparent"></div>
      <div className="pointer-events-none absolute right-0 top-20 bottom-4 w-20 bg-gradient-to-l from-black to-transparent"></div>

      <div
        ref={scroller}
        className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
        style={{ scrollBehavior: "smooth" }}
      >
        {events.map((ev) => (
          <article
            key={ev.id}
            className="group relative w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/5"
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

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

function ArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 6l-6 6 6 6"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 6l6 6-6 6"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
