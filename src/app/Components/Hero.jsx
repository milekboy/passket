"use client"; // components/HeroCarousel.jsx""
import { useEffect, useRef, useState, useCallback } from "react";

const SLIDE_INTERVAL = 6000;

export default function HeroCarousel({
  slides = [],
  heightClass = "h-[80vh]",
}) {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  const go = useCallback(
    (dir) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [slides.length]
  );

  // autoplay
  useEffect(() => {
    if (slides.length < 2) return;
    timer.current = setInterval(() => go(1), SLIDE_INTERVAL);
    return () => clearInterval(timer.current);
  }, [go, slides.length]);

  // pause on hover/focus
  const pause = () => timer.current && clearInterval(timer.current);
  const resume = () => {
    if (slides.length < 2) return;
    pause();
    timer.current = setInterval(() => go(1), SLIDE_INTERVAL);
  };

  if (!slides.length) return null;

  const active = slides[index];

  return (
    <section
      className={`relative -mt-[83px] w-full ${heightClass} overflow-hidden`}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Slides */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-out
              ${i === index ? "opacity-100" : "opacity-0"}`}
            style={{
              backgroundImage: `url(${s.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden={i !== index}
          />
        ))}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <div className="max-w-4xl text-center text-white">
          {active.kicker && (
            <p className="mb-3 text-sm md:text-base tracking-widest uppercase opacity-80">
              {active.kicker}
            </p>
          )}
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
            {active.title}
          </h1>
          {active.subtitle && (
            <p className="mt-5 text-base md:text-lg opacity-90">
              {active.subtitle}
            </p>
          )}

          {active.ctaText && (
            <a
              href={active.ctaHref || "#"}
              style={{
                animation: "zooming 1.2s infinite cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              className="inline-block mt-7 rounded-md bg-rose-500 px-6 py-3 text-sm md:text-base font-medium hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-black animate-zoom"
            >
              {active.ctaText}
            </a>
          )}
          <style jsx>{`
            @keyframes zooming {
              0%,
              100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.08);
              }
            }
          `}</style>
        </div>
      </div>

      {/* Controls */}
      <button
        aria-label="Previous slide"
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur px-3 py-2 text-white"
      >
        ‹
      </button>
      <button
        aria-label="Next slide"
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur px-3 py-2 text-white"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index ? "w-4 bg-rose-500" : "bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
