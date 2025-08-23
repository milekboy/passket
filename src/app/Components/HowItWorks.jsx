import { forwardRef } from "react";

const HowItWorks = forwardRef(function Plan(props, ref) {
  const steps = [
    {
      title: "Browse events",
      text: "Find concerts, tech meetups, comedy shows and more—curated for your city.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
            stroke="#FACC15"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: "Pay securely",
      text: "Card or bank transfer—instant confirmation and receipts in your inbox.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect
            x="2"
            y="4"
            width="20"
            height="16"
            rx="2"
            stroke="#FACC15"
            strokeWidth="2"
          />
          <path d="M2 10h20" stroke="#FACC15" strokeWidth="2" />
        </svg>
      ),
    },
    {
      title: "Scan & go",
      text: "Show your secure QR at the gate—no printing, just vibes.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 3H5a2 2 0 00-2 2v2M17 3h2a2 2 0 012 2v2M7 21H5a2 2 0 01-2-2v-2M17 21h2a2 2 0 002-2v-2"
            stroke="#FACC15"
            strokeWidth="2"
          />
          <path d="M8 11h8M8 15h8" stroke="#fff" strokeWidth="2" />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={ref}
      className="relative mx-auto mt-20 max-w-7xl px-4 sm:px-6"
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-10 h-40 blur-2xl"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 0%, rgba(168,85,247,.25), rgba(0,0,0,0))",
        }}
      />
      <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-white">
        How it works
      </h2>

      <div className="relative grid gap-6 md:grid-cols-3">
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-1 w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-600 via-yellow-400 to-pink-600 md:block" />
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
          >
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 transition group-hover:ring-pink-500/60" />
            <div className="pointer-events-none absolute -right-1 -top-2 text-7xl font-black leading-none text-white/5">
              {i + 1}
            </div>
            <div className="mb-4 inline-flex items-center justify-center rounded-full border border-yellow-400/30 bg-black/40 p-3">
              {s.icon}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
            <p className="text-sm text-white/70">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
});
export default HowItWorks;
