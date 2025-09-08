"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  PlusCircleIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  CurrencyEuroIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import NetworkInstance from "../Components/NetworkInstance";
import DashboardLayout from "./DashboardLayout";
const fmtNaira = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

// --- demo data to start ---
const demoEvents = [
  {
    id: "ev1",
    title: "Lagos Tech Fest",
    date: "Oct 4",
    status: "Draft",
    ticketsSold: 0,
    revenue: 0,
  },
  {
    id: "ev2",
    title: "Afrobeats Night",
    date: "Nov 12",
    status: "Published",
    ticketsSold: 312,
    revenue: 2480000,
  },
  {
    id: "ev3",
    title: "Comedy Unplugged",
    date: "Dec 03",
    status: "Published",
    ticketsSold: 127,
    revenue: 890000,
  },
];

export default function DashboardHome() {
  const [events] = useState(demoEvents);
  const [withdrawing, setWithdrawing] = useState(false);
  const [amount, setAmount] = useState("");

  const stats = useMemo(() => {
    const published = events.filter((e) => e.status === "Published");
    const totalSold = published.reduce((a, c) => a + (c.ticketsSold || 0), 0);
    const gross = published.reduce((a, c) => a + (c.revenue || 0), 0);
    const fees = Math.round(
      published.reduce((a, c) => {
        // fee per paid ticket: 5% + ₦100 (approx, demo calc)
        const avgPrice = c.ticketsSold
          ? Math.max(1, Math.round(c.revenue / c.ticketsSold))
          : 0;
        return a + c.ticketsSold * Math.round(avgPrice * 0.05 + 100);
      }, 0)
    );
    const net = gross - fees;
    return { totalSold, gross, fees, net };
  }, [events]);

  const currentBalance = stats.net; // demo assumption

  const doWithdraw = async () => {
    if (!amount) return;
    try {
      setWithdrawing(true);
      const api = NetworkInstance(); // if yours exports a function; else just NetworkInstance
      await api.post("/payouts/withdraw", { amount: Number(amount) });
      alert("Withdrawal requested!");
      setAmount("");
    } catch (e) {
      console.error(e);
      alert("Failed to withdraw. Try again.");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <DashboardLayout>
      <section className="space-y-8">
        {/* Page title + quick CTA */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-white/60">
              Overview of your events, tickets, and balance.
            </p>
          </div>
          <Link
            href="/dashboard/events/new"
            className="inline-flex items-center gap-2 rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-400/20"
          >
            <PlusCircleIcon className="h-5 w-5" />
            Create Event
          </Link>
        </div>

        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Tickets sold"
            value={stats.totalSold.toLocaleString()}
            chip="+8% wk"
            icon={<ArrowUpRightIcon className="h-5 w-5" />}
          />
          <Stat
            label="Gross revenue"
            value={fmtNaira(stats.gross)}
            chip="All events"
            icon={<CurrencyEuroIcon className="h-5 w-5" />}
          />
          <Stat
            label="Fees paid"
            value={fmtNaira(stats.fees)}
            chip="5% + ₦100"
            icon={<ArrowDownRightIcon className="h-5 w-5" />}
          />
          <Stat
            label="Net balance"
            value={fmtNaira(stats.net)}
            chip="Available"
            icon={<CheckCircleIcon className="h-5 w-5" />}
          />
        </div>

        {/* Balance / Withdraw */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:col-span-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Current Balance
              </h3>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
                NDPA/NDPC compliant
              </span>
            </div>
            <div className="mt-2 text-3xl font-extrabold text-yellow-400">
              {fmtNaira(currentBalance)}
            </div>
            <p className="mt-1 text-sm text-white/60">
              After fees. Updates in real-time after sales.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="w-1/2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white placeholder-white/40 focus:border-yellow-400 focus:ring focus:ring-yellow-400/30"
              />
              <button
                onClick={doWithdraw}
                disabled={withdrawing || !amount}
                className="flex-1 rounded-lg bg-pink-600 px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-50"
              >
                {withdrawing ? "Processing..." : "Withdraw"}
              </button>
            </div>

            <p className="mt-2 text-xs text-white/50">
              Payouts settle to your linked bank. Typical turnaround 24–48h.
            </p>
          </div>

          {/* Recent events table */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Recent Events
              </h3>
              <Link
                href="/dashboard/events"
                className="text-sm text-yellow-300 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-white/80">
                <thead className="text-xs uppercase text-white/50">
                  <tr>
                    <th className="py-2 pr-4">Event</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Tickets sold</th>
                    <th className="py-2 pr-4">Revenue</th>
                    <th className="py-2 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.id} className="border-t border-white/10">
                      <td className="py-3 pr-4">{ev.title}</td>
                      <td className="py-3 pr-4">{ev.date}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] ${
                            ev.status === "Published"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-white/10 text-white/70"
                          }`}
                        >
                          {ev.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4">{ev.ticketsSold}</td>
                      <td className="py-3 pr-4">{fmtNaira(ev.revenue)}</td>
                      <td className="py-3 pl-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/events/${ev.id}/edit`}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10"
                          >
                            Edit
                          </Link>
                          {ev.status !== "Published" ? (
                            <Link
                              href={`/dashboard/events/${ev.id}/publish`}
                              className="rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-xs text-yellow-300 hover:bg-yellow-400/20"
                            >
                              Publish
                            </Link>
                          ) : (
                            <Link
                              href={`/dashboard/events/${ev.id}/tickets`}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10"
                            >
                              Manage tickets
                            </Link>
                          )}
                          <Link
                            href={`/dashboard/events/${ev.id}/delete`}
                            className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/20"
                          >
                            Delete
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {events.length === 0 && (
                <div className="py-10 text-center text-white/60">
                  No events yet. Create your first event!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            title="Create event"
            href="/dashboard/events/new"
            desc="Set title, date, venue"
          />
          <QuickAction
            title="Create tickets"
            href="/dashboard/tickets/new"
            desc="Add multiple ticket types"
          />
          <QuickAction
            title="Publish event"
            href="/dashboard/events"
            desc="Make it live & start selling"
          />
          <QuickAction
            title="Scan tickets"
            href="/dashboard/tools/scanner"
            desc="Verify entries at the gate"
          />
        </div>
      </section>
    </DashboardLayout>
  );
}

/* Small components */

function Stat({ label, value, chip, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-white/50">
          {label}
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
          {chip}
        </span>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-2xl font-extrabold text-white">{value}</div>
        <div className="text-white/60">{icon}</div>
      </div>
    </div>
  );
}

function QuickAction({ title, desc, href }) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
    >
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 transition group-hover:ring-pink-500/60" />
      <div className="text-white font-semibold">{title}</div>
      <div className="text-sm text-white/70">{desc}</div>
      <span className="mt-3 inline-block rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white transition group-hover:brightness-110">
        Go
      </span>
    </Link>
  );
}
