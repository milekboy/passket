import Link from "next/link";
import Image from "next/image";

export default function EventCard({ ev }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="relative h-44 w-full">
        <Image
          src={ev.image}
          alt={`${ev.title} poster`}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 25vw, 50vw"
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
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 transition group-hover:ring-pink-500/60" />
    </article>
  );
}
