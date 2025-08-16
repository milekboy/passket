import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black/40">
      {/* glow */}
      <div
        className="pointer-events-none absolute -top-10 left-1/2 h-24 w-[60vw] -translate-x-1/2 blur-2xl"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 50%, rgba(236,72,153,.18), rgba(0,0,0,0))",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* top grid */}
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="text-lg font-extrabold text-white">Passket</div>
            <p className="mt-2 text-sm text-white/70">
              Tickets for everything you love. Built for fans, loved by
              organisers.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
              <Badge>Secure checkout</Badge>
              <Badge>NDPA/NDPC compliant</Badge>
              <Badge>Refund support</Badge>
            </div>
          </div>

          <NavCol
            title="Company"
            links={[
              ["About", "/about"],
              ["Careers", "/careers"],
              ["Press", "/press"],
              ["Contact", "/contact"],
            ]}
          />
          <NavCol
            title="For organisers"
            links={[
              ["List your event", "/dashboard/events/new"],
              ["Pricing", "/pricing"],
              ["Docs & API", "/developers"],
              ["Support", "/help"],
            ]}
          />
          <NavCol
            title="Support"
            links={[
              ["Help Center", "/help"],
              ["Payments & refunds", "/help/payments"],
              ["Entry & scanning", "/help/scanning"],
              ["Privacy", "/privacy"],
            ]}
          />
        </div>

        {/* city links */}
        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/70">
          Popular:{" "}
          <Link className="hover:text-white" href="/city/lagos">
            Lagos
          </Link>{" "}
          •{" "}
          <Link className="hover:text-white" href="/city/abuja">
            Abuja
          </Link>{" "}
          •{" "}
          <Link className="hover:text-white" href="/city/port-harcourt">
            Port Harcourt
          </Link>{" "}
          •{" "}
          <Link className="hover:text-white" href="/city/ibadan">
            Ibadan
          </Link>
        </div>

        {/* bottom row */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row">
          <div>© {year} Passket, Inc. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <a href="/terms" className="hover:text-white">
              Terms
            </a>
            <a href="/privacy" className="hover:text-white">
              Privacy
            </a>
            <a href="/cookies" className="hover:text-white">
              Cookies
            </a>
            <div className="ml-2 flex items-center gap-3">
              <Social href="https://instagram.com">
                <Instagram />
              </Social>
              <Social href="https://x.com">
                <XIcon />
              </Social>
              <Social href="https://facebook.com">
                <Facebook />
              </Social>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Helpers */

function NavCol({ title, links }) {
  return (
    <div>
      <div className="text-sm font-semibold uppercase tracking-wide text-white/60">
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link className="text-white/80 hover:text-white" href={href}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/70">
      {children}
    </span>
  );
}

function Social({ href, children }) {
  return (
    <a
      href={href}
      aria-label="social"
      className="rounded-full border border-white/15 bg-white/5 p-2 text-white/80 hover:text-white hover:bg-white/10"
    >
      {children}
    </a>
  );
}

/* Icons */

function Instagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 4l16 16M20 4L4 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function Facebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 9h3V6h-3a4 4 0 00-4 4v3H7v3h3v6h3v-6h3l1-3h-4v-3a1 1 0 011-1z"
        fill="currentColor"
      />
    </svg>
  );
}
