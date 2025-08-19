"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function CategoryMarquee({
  categories = [],
  activeId,
  onSelect,
  className = "",
}) {
  const scrollerRef = useRef(null);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Duplicate list for seamless wrap-around
  const data = useMemo(
    () => (categories.length ? [...categories, ...categories] : []),
    [categories]
  );

  // (Optional) respect OS "reduce motion" — set to false if you always want motion
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const m = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduceMotion(m.matches);
      const onChange = (e) => setReduceMotion(e.matches);
      m.addEventListener?.("change", onChange);
      return () => m.removeEventListener?.("change", onChange);
    }
  }, []);

  // Auto-scroll loop
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !data.length || reduceMotion) return;

    // Only animate if overflow exists
    const hasOverflow = el.scrollWidth > el.clientWidth + 2;
    if (!hasOverflow) return;

    let last = null;
    const SPEED = 60; // px/sec – tweak to taste

    const step = (ts) => {
      if (!el) return;
      if (last == null) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;

      if (!pausedRef.current) {
        el.scrollLeft += SPEED * dt;

        // Correct loop point: half of the *scrollable distance*
        const maxScroll = el.scrollWidth - el.clientWidth;
        const loopPoint = maxScroll / 2;

        if (el.scrollLeft >= loopPoint) {
          el.scrollLeft -= loopPoint; // seamless jump back by one "set"
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    // Kick off
    rafRef.current = requestAnimationFrame(step);

    // Re-run if layout changes (e.g., images load) by nudging scrollLeft
    const rebalance = () => {
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return; // no overflow anymore
      el.scrollLeft = el.scrollLeft % (maxScroll / 2);
    };
    const ro = new ResizeObserver(rebalance);
    ro.observe(el);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [data, reduceMotion]);

  // Drag / swipe / wheel
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startLeft = 0;
    let wheelTimer = null;

    const pauseFor = (ms = 600) => {
      pausedRef.current = true;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        pausedRef.current = false;
      }, ms);
    };

    // Pointer events (mouse + touch)
    const onPointerDown = (e) => {
      isDown = true;
      el.setPointerCapture?.(e.pointerId);
      pausedRef.current = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onPointerMove = (e) => {
      if (!isDown) return;
      const delta = e.clientX - startX;
      el.scrollLeft = startLeft - delta;
    };
    const onPointerUp = (e) => {
      isDown = false;
      el.releasePointerCapture?.(e.pointerId);
      pausedRef.current = false;
    };

    const onWheel = () => pauseFor(800);

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("wheel", onWheel);
      clearTimeout(wheelTimer);
    };
  }, []);

  if (!categories.length) return null;

  return (
    <section className={`relative ${className}`}>
      <div className="mb-4 flex items-center justify-end px-4 sm:px-6">
        {activeId && (
          <button
            onClick={() => onSelect?.(null)}
            className="mt-5 cursor-pointer rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-md text-white/80 hover:bg-white/10"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* edge fades */}
      <div className="pointer-events-none absolute left-0 top-12 bottom-4 w-20 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute right-0 top-12 bottom-4 w-20 bg-gradient-to-l from-black to-transparent" />

      <div
        ref={scrollerRef}
        className="hide-scrollbar relative mx-auto flex gap-4 overflow-x-auto px-4 pb-3 sm:px-6"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {data.map((cat, i) => {
          const selected = activeId === cat.id;
          return (
            <button
              key={`${cat.id}-${i}`}
              onClick={() => onSelect?.(selected ? null : cat.id)}
              className={`group cursor-pointer relative flex w-[120px] flex-col items-center rounded-2xl border bg-white/5 p-3 backdrop-blur-md transition hover:bg-white/10
                ${
                  selected
                    ? "border-yellow-400/50 ring-2 ring-yellow-300/40"
                    : "border-white/10"
                }`}
              aria-pressed={selected}
              title={cat.name}
            >
              <div className="relative mb-2 h-20 w-20 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                {cat.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover opacity-90"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    {cat.icon ? cat.icon : <DefaultIcon />}
                  </div>
                )}
                {selected && (
                  <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-yellow-300/60" />
                )}
              </div>
              <span
                className={`text-sm ${
                  selected ? "text-yellow-300" : "text-white/80"
                }`}
              >
                {cat.name}
              </span>
              {selected && (
                <span className="mt-1 rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-semibold text-black">
                  Selected
                </span>
              )}
            </button>
          );
        })}
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

function DefaultIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
