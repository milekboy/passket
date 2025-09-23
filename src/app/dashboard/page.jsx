"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import {
  PlusCircleIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  BanknotesIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import NetworkInstance from "../Components/NetworkInstance";
import DashboardLayout from "./DashboardLayout";
import Toast from "../Components/Toast";
import { useAuth } from "@/app/Components/AuthContext";
const fmtNaira = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return "—";
  }
};

export default function DashboardHome() {
  const [events, setEvents] = useState([]); // not undefined
  const api = NetworkInstance();
  const { token } = useAuth();
  const [withdrawing, setWithdrawing] = useState(false);
  const [amount, setAmount] = useState("");
  const [toast, showToast] = useState({ type: "", message: "" });
  const fetchEvents = async () => {
    try {
      const res = await api.get("/Event/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list =
        res?.data?.events ??
        res?.data?.data ??
        (Array.isArray(res?.data) ? res.data : []) ??
        [];
      setEvents(list);
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to load events.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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
  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await api.delete(`/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("success", "Event deleted.");
    } catch (e) {
      console.error(e);
      showToast("error", `${e.response.data.error}`);
    }
  };
  return (
    <DashboardLayout>
      <section className="space-y-8">
        {/* Page title + quick CTA */}
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-white/60">
              Overview of your events, tickets, and balance.
            </p>
          </div>
          <Link
            href="/dashboard/create-event"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-400/20 sm:w-auto"
          >
            <PlusCircleIcon className="h-5 w-5" />
            Create Event
          </Link>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            icon={<BanknotesIcon className="h-5 w-5" />}
          />
          <Stat
            label="Fees paid"
            value={fmtNaira(0)}
            chip="5% + ₦100"
            icon={<ArrowDownRightIcon className="h-5 w-5" />}
          />
          <Stat
            label="Net balance"
            value={fmtNaira(0)}
            chip="Available"
            icon={<CheckCircleIcon className="h-5 w-5" />}
          />
        </div>

        {/* Balance / Withdraw */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Balance card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:col-span-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Current Balance
              </h3>
              <span className="rounded-full w-full border border-white/10 bg-white/5 px-2 flex justify-center items-center py-0.5 text-[11px] text-white/70">
                NDPA/NDPC compliant
              </span>
            </div>
            <div className="mt-2 text-3xl font-extrabold text-yellow-400">
              {fmtNaira(10000)}
            </div>
            <p className="mt-1 text-sm text-white/60">
              After fees. Updates in real-time after sales.
            </p>

            {/* Withdraw controls: stack on mobile */}
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
              <input
                // type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white placeholder-white/40 focus:border-yellow-400 focus:ring focus:ring-yellow-400/30 "
              />
              <button
                onClick={doWithdraw}
                disabled={withdrawing || !amount}
                className="w-full rounded-lg  cursor-pointer bg-pink-600 px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-50 "
              >
                {withdrawing ? "Processing..." : "Withdraw"}
              </button>
            </div>

            <p className="mt-2 text-xs text-white/50">
              Payouts settle to your linked bank. Typical turnaround 24–48h.
            </p>
          </div>

          {/* Recent events: mobile cards + desktop table */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:col-span-2 ">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Recent Events
              </h3>
              <Link
                href="/dashboard/admin-all-events"
                className="text-sm text-yellow-300 hover:underline"
              >
                View all
              </Link>
            </div>

            {/* Mobile: card list */}
            <ul className="space-y-3 md:hidden">
              {events.map((ev) => (
                <li
                  key={ev.id}
                  className="rounded-xl border border-white/10 bg-black/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-white font-semibold line-clamp-1">
                        {ev.title}
                      </div>
                      <div className="mt-1 text-sm text-white/60">
                        {formatDate(ev.startDate)}
                        {ev.endDate ? ` → ${formatDate(ev.endDate)}` : ""}
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        {ev.location || "—"}
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        Tickets:{" "}
                        {Array.isArray(ev.ticketTiers)
                          ? ev.ticketTiers.length
                          : 0}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
                        ev.status === "Published"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-white/10 text-white/70"
                      }`}
                    >
                      {ev.status || "Draft"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/events/${ev.id}`}
                      className="rounded-lg cursor-pointer border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10"
                    >
                      Manage
                    </Link>
                    {ev.status !== "Published" ? (
                      <button className="rounded-lg cursor-pointer border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-xs text-yellow-300 hover:bg-yellow-400/20">
                        Publish
                      </button>
                    ) : (
                      <Link
                        href={`/dashboard/events/${ev.id}`}
                        className="rounded-lg cursor-pointer border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10"
                      >
                        Tickets
                      </Link>
                    )}
                    <button
                      onClick={() => deleteEvent(ev.id)}
                      className="rounded-lg cursor-pointer border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/20 "
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {events.length === 0 && (
                <li className="rounded-xl border border-white/10 bg-black/40 p-6 text-center text-white/60">
                  No events yet. Create your first event!
                </li>
              )}
            </ul>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto ">
              <table className="min-w-full text-left text-sm text-white/80">
                <thead className="text-xs uppercase text-white/50">
                  <tr>
                    <th className="py-2 pr-4">Event</th>
                    <th className="py-2 pr-4">Dates</th>
                    <th className="py-2 pr-4">Location</th>
                    <th className="py-2 pr-4">Tickets</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.id} className="border-t border-white/10">
                      <td className="py-3 pr-4 max-w-[260px]">
                        <div className="font-semibold text-white line-clamp-1">
                          {ev.title}
                        </div>
                        <div className="text-xs text-white/50 line-clamp-1">
                          {ev.description}
                        </div>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {formatDate(ev.startDate)}
                        {ev.endDate ? ` → ${formatDate(ev.endDate)}` : ""}
                      </td>
                      <td className="py-3 pr-4 max-w-[220px] truncate">
                        {ev.location || "—"}
                      </td>
                      <td className="py-3 pr-4">
                        {Array.isArray(ev.ticketTiers)
                          ? ev.ticketTiers.length
                          : 0}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] ${
                            ev.status === "Published"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-white/10 text-white/70"
                          }`}
                        >
                          {ev.status || "Draft"}
                        </span>
                      </td>
                      <td className="py-3 pl-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/admin-event/${ev.id}`}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10 cursor-pointer"
                          >
                            Manage
                          </Link>
                          {ev.status !== "Published" ? (
                            <button className="rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-xs text-yellow-300 hover:bg-yellow-400/20 cursor-pointer">
                              Publish
                            </button>
                          ) : (
                            <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10 cursor-pointer">
                              Tickets
                            </button>
                          )}
                          <button
                            onClick={() => deleteEvent(ev.id)}
                            className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/20 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-white/60"
                      >
                        No events yet. Create your first event!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            title="Create event"
            href="/dashboard/create-event"
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
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: "", message: "" })}
        />
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
