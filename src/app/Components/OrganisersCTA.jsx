"use client";
export default function OrganiserCTA({
  brandName = "Passket",
  primaryHref = "/dashboard/events/new",
  secondaryHref = "/contact?type=sales",
}) {
  return (
    <section className="relative mx-auto mt-20 max-w-7xl px-4 sm:px-6">
      {/* ambient glows */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[70vw] -translate-x-1/2 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(236,72,153,.18), rgba(0,0,0,0))",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(250,204,21,.18), rgba(0,0,0,0))",
        }}
      />

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 backdrop-blur-md">
        {/* animated gradient edge */}
        <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10 [mask-image:linear-gradient(#000,transparent)]" />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* LEFT: copy + CTAs */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-black/40 px-3 py-1 text-xs text-yellow-300">
              <Spark /> Built for organisers
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Sell out faster with {brandName}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              Launch events in minutes. Get paid quickly. Stop counterfeit
              tickets with secure QR entry. Real-time dashboards show you sales
              as they happen.
            </p>

            {/* value bullets */}
            <ul className="mt-6 grid max-w-xl gap-3 sm:grid-cols-2">
              <li className="flex items-center gap-3">
                <Dot /> Fast payouts (T+1)
              </li>
              <li className="flex items-center gap-3">
                <Dot /> Fraud-proof QR tickets
              </li>
              <li className="flex items-center gap-3">
                <Dot /> Live sales dashboard
              </li>
              <li className="flex items-center gap-3">
                <Dot /> Refund support
              </li>
            </ul>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={primaryHref}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                <span className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-pink-600 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-60" />
                List your event
              </a>
              <a
                href={secondaryHref}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                Talk to sales <Arrow />
              </a>
            </div>

            {/* trust strip */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/60">
              <div className="inline-flex items-center gap-2">
                <Shield /> Privacy-first (NDPA/NDPC compliant)
              </div>
              <div className="inline-flex items-center gap-2">
                <Lock /> Secure checkout
              </div>
              <div className="inline-flex items-center gap-2">
                <Chart /> Real-time insights
              </div>
            </div>
          </div>

          {/* RIGHT: stat card + floating ticket */}
          <div className="relative">
            {/* floating ticket stub */}
            <div className="absolute -top-6 -left-4 hidden rotate-[-6deg] sm:block">
              <TicketStub />
            </div>

            {/* glass stats card */}
            <div className="relative ml-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Live sales</h3>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                  Online
                </span>
              </div>

              {/* sparkline */}
              <div className="mt-4 h-20 w-full">
                <svg viewBox="0 0 200 60" className="h-full w-full">
                  <defs>
                    <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(236,72,153,.7)" />
                      <stop offset="100%" stopColor="rgba(236,72,153,0)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,45 L20,40 L35,42 L50,30 L70,35 L90,18 L110,26 L125,20 L145,27 L165,12 L185,18 L200,10"
                    stroke="rgba(236,72,153,1)"
                    strokeWidth="2.5"
                    fill="url(#grad)"
                  />
                </svg>
              </div>

              {/* metrics */}
              <div className="mt-3 grid grid-cols-3 gap-3">
                <Metric label="Tickets sold" value="1,284" />
                <Metric label="GMV today" value="₦3.9m" />
                <Metric label="Conversion" value="3.8%" />
              </div>

              {/* divider */}
              <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* mini checklist */}
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <Check /> Early bird ends in{" "}
                  <span className="font-semibold text-yellow-300">
                    02:41:12
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check /> Payout scheduled{" "}
                  <span className="font-semibold text-white">
                    Tomorrow 9:00
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* subtle animated border glow */}
        <span className="pointer-events-none absolute -inset-px rounded-3xl opacity-60 [background:conic-gradient(from_180deg_at_50%_50%,rgba(236,72,153,.15),rgba(250,204,21,.15),rgba(147,51,234,.15),rgba(236,72,153,.15))] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-px" />
      </div>

      <style jsx>{`
        .ticket-hole {
          background: radial-gradient(
            circle at center,
            #000 0 6px,
            transparent 6px
          );
          mask: radial-gradient(circle at center, transparent 0 6px, #000 6px);
        }
      `}</style>
    </section>
  );
}

/* --- Sub-components / icons --- */

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-[11px] uppercase tracking-wide text-white/50">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function TicketStub() {
  return (
    <div className="relative w-60 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-md">
      {/* perforation */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
      {/* notches */}
      <div className="ticket-hole absolute -left-3 top-10 h-6 w-6 rounded-full" />
      <div className="ticket-hole absolute -right-3 bottom-10 h-6 w-6 rounded-full" />
      {/* QR placeholder */}
      <div className="rounded-lg border border-white/10 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.12)_0_6px,rgba(255,255,255,.06)_6px_12px)] p-3">
        <div className="h-20 w-20 bg-[repeating-linear-gradient(90deg,#fff_0_3px,transparent_3px_6px),repeating-linear-gradient(0deg,#fff_0_3px,transparent_3px_6px)] opacity-80" />
      </div>
      <div className="mt-3">
        <div className="text-[10px] uppercase tracking-wide text-white/50">
          Admit one
        </div>
        <div className="text-sm font-semibold text-white">VIP • Lagos</div>
      </div>
    </div>
  );
}

function Spark() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8L12 2z"
        stroke="#FACC15"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function Dot() {
  return (
    <span className="h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,.8)]" />
  );
}
function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Shield() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7l8-4z"
        stroke="#fff"
        strokeOpacity=".6"
        strokeWidth="1.5"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="#22c55e"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Lock() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <rect
        x="4"
        y="10"
        width="16"
        height="10"
        rx="2"
        stroke="#fff"
        strokeOpacity=".6"
        strokeWidth="1.5"
      />
      <path
        d="M8 10V8a4 4 0 118 0v2"
        stroke="#fff"
        strokeOpacity=".6"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function Chart() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M4 20V6M10 20V10M16 20V4"
        stroke="#fff"
        strokeOpacity=".6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M5 13l4 4L19 7"
        stroke="#22c55e"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
