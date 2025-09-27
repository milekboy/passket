"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../Components/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  CalendarIcon,
  TicketIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const pathname = usePathname();
  // console.log(user, token);
  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
    }
  }, [user, token, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  const nav = [
    { name: "Overview", href: "/dashboard", icon: Squares2X2Icon },
    { name: "Events", href: "/dashboard/admin-all-events", icon: CalendarIcon },
    { name: "Scan Tickets", href: "/dashboard/tickets", icon: TicketIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/40 to-black">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen((s) => !s)}
              className="lg:hidden rounded-lg border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <Link
              href="/"
              className="text-lg font-extrabold tracking-tight text-yellow-400"
            >
              Passket Host
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-white/70 sm:block">
              Hello, {user?.firstName || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-xl border cursor-pointer border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
            >
              <ArrowRightOnRectangleIcon className="mr-1 inline h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Shell */}
      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-[56px] z-30 h-[calc(100vh-56px)] w-72 transform border-r border-white/10 bg-black/50 p-4 backdrop-blur-md transition-transform lg:static lg:translate-x-0 lg:overflow-hidden ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* 👇 Add greeting here */}
          <div className="mb-4 lg:hidden text-sm font-medium text-white/80">
            Hello, {user?.firstName || "User"}
          </div>

          <nav className="space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition ${
                    active
                      ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-300"
                      : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            {" "}
            <div className="text-xs uppercase tracking-wide text-white/50">
              Role
            </div>{" "}
            <div className="mt-1 text-sm text-white">{user?.role}</div>{" "}
            {/* <div className="mt-3 h-2 w-full overflow-hidden rounded bg-white/10">
          
              <div className="h-full w-1/3 bg-yellow-400" />{" "}
            </div>{" "}
            <div className="mt-2 text-xs text-white/60">
              {" "}
              2 / 6 active events{" "}
            </div>{" "} */}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 px-4 pb-24 pt-6 sm:px-6">{children}</main>
      </div>

      <style jsx global>{`
        /* Hide mobile sidebar when clicking content on small screens */
        @media (max-width: 1023px) {
          main {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
