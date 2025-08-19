import EventCard from "./EventCard";

export default function EventGrid({ events = [] }) {
  if (!events.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6">
        <div className="inline-block rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white/70">
          No events match this filter… yet.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {events.map((ev) => (
          <EventCard key={ev.id} ev={ev} />
        ))}
      </div>
    </div>
  );
}
