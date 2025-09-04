"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NetworkInstance from "../Components/NetworkInstance";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import LoadingTicket from "../Components/LoadingTicket";
import { TicketIcon } from "@heroicons/react/24/solid"; // heroicons for excitement

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await NetworkInstance.post("/auth/login", form);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Invalid credentials.");
      setLoading(false);
    }
  };

  if (loading) return <LoadingTicket />;

  return (
    <>
      <Header />
      <main className="relative flex min-h-screen items-center bg-gradient-to-b from-black via-purple-950/40 to-black">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(236,72,153,.25), transparent 60%), radial-gradient(circle at 80% 80%, rgba(250,204,21,.25), transparent 60%)",
          }}
        />

        {/* Split layout */}
        <div className="flex w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
          {/* LEFT SIDE — exciting visual */}
          <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-pink-600 via-yellow-400 to-purple-700 p-8 text-black">
            <TicketIcon className="w-24 h-24 mb-6 animate-bounce" />
            <h2 className="text-3xl font-extrabold mb-2">
              Your Event Journey Awaits!
            </h2>
            <p className="text-black/80 text-center text-sm">
              Manage events, sell tickets, and track your success — all in one
              place.
            </p>
          </div>

          {/* RIGHT SIDE — login form */}
          <div className="w-full md:w-1/2 p-10">
            <h1 className="mb-2 text-center text-3xl font-extrabold tracking-tight text-yellow-400">
              Welcome Back 🎟️
            </h1>
            <p className="mb-6 text-center text-sm text-white/70">
              Log in to manage your events, track sales, and scan tickets.
            </p>

            {error && (
              <p className="mb-4 rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-white/80"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-white/80"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 cursor-pointer w-full transform rounded-lg bg-gradient-to-r from-pink-600 via-yellow-400 to-pink-600 px-4 py-2 font-semibold text-black shadow-md transition hover:scale-[1.02] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Login to Host Dashboard"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/60">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-yellow-400 hover:underline"
              >
                Sign up as an Organizer
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
