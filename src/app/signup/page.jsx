"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NetworkInstance from "../Components/NetworkInstance";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import LoadingTicket from "../Components/LoadingTicket";

export default function RegisterPage() {
  const router = useRouter();
  const networkInstance = NetworkInstance();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await networkInstance.post("/auth/register", {
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      });
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const isPasswordMismatch =
    form.password &&
    form.confirmPassword &&
    form.password !== form.confirmPassword;

  if (loading) {
    return <LoadingTicket />;
  }

  return (
    <>
      <Header />
      <main className="relative min-h-screen  bg-gradient-to-b from-black via-purple-950/40 to-black flex items-center justify-center px-6 py-12">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(236,72,153,.3), transparent 60%), radial-gradient(circle at 80% 80%, rgba(250,204,21,.3), transparent 60%)",
          }}
        />

        <div className="flex w-full max-w-6xl  overflow-hidden rounded-2xl shadow-lg border border-white/10 bg-white/5 backdrop-blur-lg">
          {/* Left side (visuals) */}
          <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-purple-700/40 via-black to-black relative">
            <div className="absolute inset-0 bg-[url('/ticket-pattern.png')] bg-cover bg-center opacity-20" />
            <div className="relative z-10 text-center p-8">
              <h2 className="text-4xl font-extrabold text-yellow-400 mb-4">
                🎟️ Your Stage Awaits
              </h2>
              <p className="text-white/80 text-lg">
                Share your events, sell tickets, and reach thousands of fans
                with ease.
              </p>
            </div>
          </div>

          {/* Right side (form) */}
          <div className="flex-1 p-8 lg:p-12">
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-yellow-400 text-center">
              Host Events with Ease 🚀
            </h1>
            <p className="mb-6 text-center text-sm text-white/70">
              Create your organizer account to publish events, sell tickets, and
              track sales in one place.
            </p>

            {error && (
              <p className="mb-4 rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1 block text-sm font-medium text-white/80"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1 block text-sm font-medium text-white/80"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
                />
              </div>

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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1 block text-sm font-medium text-white/80"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-lg border ${
                    isPasswordMismatch
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                      : "border-white/10 focus:border-yellow-400 focus:ring-yellow-400/40"
                  } bg-black/40 px-4 py-2 text-white`}
                />
                {isPasswordMismatch && (
                  <p className="mt-1 text-sm text-red-400">
                    Passwords do not match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || isPasswordMismatch}
                className="mt-4 cursor-pointer w-full transform rounded-lg bg-gradient-to-r from-pink-600 via-yellow-400 to-pink-600 px-4 py-2 font-semibold text-black shadow-md transition hover:scale-[1.02] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Sign up as an Organizer"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/60">
              Already hosting events?{" "}
              <a
                href="/login"
                className="font-medium text-yellow-400 hover:underline"
              >
                Login to your host account
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
