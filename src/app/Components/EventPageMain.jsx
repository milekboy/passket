"use client";

import { useMemo, useState } from "react";
import CategoryMarquee from "./CategoryMarquee";
import EventGrid from "./EventGrid";

// Example icons (optional) for categories without images
function MusicIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 19a2 2 0 11-4 0 2 2 0 014 0zM17 17a2 2 0 11-4 0 2 2 0 014 0z"
        stroke="#FACC15"
        strokeWidth="2"
      />
      <path
        d="M9 17V5l10-2v12"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function EventPageMain({
  categories = [
    {
      id: "music",
      name: "Music",
      image:
        "https://res.cloudinary.com/dbpjskran/image/upload/v1755589530/150353329_10487893_uxcxuk.jpg",
    },
    {
      id: "tech",
      name: "Tech & Conferences",
      image:
        "https://res.cloudinary.com/dbpjskran/image/upload/v1755589257/2151255076_xuqdrc.jpg",
    },
    {
      id: "comedy",
      name: "Comedy",
      image:
        "https://res.cloudinary.com/dbpjskran/image/upload/v1755589263/2151027823_gqhped.jpg",
    },
    {
      id: "sports",
      name: "Sports",
      image:
        "https://res.cloudinary.com/dbpjskran/image/upload/v1755589270/138077_rf7n4o.jpg",
    },
    {
      id: "theatre",
      name: "Theatre",
      image:
        "https://res.cloudinary.com/dbpjskran/image/upload/v1755589279/2151949833_htk4el.jpg",
    },
    {
      id: "festival",
      name: "Festival",
      image:
        "https://res.cloudinary.com/dbpjskran/image/upload/v1755589286/544_bysl9g.jpg",
    },
    {
      id: "faith",
      name: "Faith",
      image:
        "https://res.cloudinary.com/dbpjskran/image/upload/v1755589293/7219_c6v2cu.jpg",
    },
    {
      id: "family",
      name: "Family",
      image:
        "https://res.cloudinary.com/dbpjskran/image/upload/v1755589301/2149489597_dhretz.jpg",
    },
  ],
  events = [],
}) {
  const [activeCat, setActiveCat] = useState(null);

  const filtered = useMemo(() => {
    if (!activeCat || activeCat === "all") return events;
    // Accept either a single 'category' field or an array 'categories' on each event
    return events.filter((ev) =>
      Array.isArray(ev.categories)
        ? ev.categories.includes(activeCat)
        : ev.category === activeCat
    );
  }, [events, activeCat]);

  return (
    <section className="pb-16">
      {/* Categories loop */}
      <CategoryMarquee
        categories={categories}
        activeId={events}
        onSelect={(id) => setActiveCat(id)}
        className="mx-auto max-w-7xl"
      />

      {/* Filter chip */}
      <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6">
        {activeCat && activeCat !== "all" && (
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-white/5 px-3 py-1 text-xs text-yellow-300">
            <span className="h-2 w-2 rounded-full bg-yellow-300" />
            Showing:{" "}
            {categories.find((c) => c.id === activeCat)?.name || activeCat}
          </div>
        )}
      </div>

      {/* Events grid */}
      <div className="mt-6">
        <EventGrid events={filtered} />
      </div>
    </section>
  );
}
