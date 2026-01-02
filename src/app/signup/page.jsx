"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NetworkInstance from "../Components/NetworkInstance";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import LoadingTicket from "../Components/LoadingTicket";

import { TicketIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      await networkInstance.post("/user/register", {
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      });
      router.push("/login");
    } catch (err) {
      console.error("err", err);
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
      <main className="relative flex min-h-screen items-center justify-center bg-[#0a0a0a] overflow-hidden py-12">
        {/* Animated Background Elements */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/20 blur-[120px] animate-pulse delay-1000" />

        <div className="relative z-10 w-full max-w-6xl mx-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col lg:flex-row">
            {/* Left Side - Visual */}
            <div className="relative w-full lg:w-5/12 p-12 flex flex-col items-center justify-center text-center overflow-hidden group min-h-[400px] lg:min-h-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-pink-600/90 z-0 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay" />
                
                {/* Floating Icons/Shapes */}
                <div className="relative z-10 mb-8 transform transition-transform duration-700 hover:scale-110 hover:rotate-3">
                   <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
                   <TicketIcon className="w-32 h-32 text-white drop-shadow-2xl relative z-10" />
                </div>
                
                <h2 className="relative z-10 text-4xl font-bold text-white mb-4 tracking-tight">
                    Your Stage <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">Awaits</span>
                </h2>
                <p className="relative z-10 text-purple-100 text-lg max-w-sm leading-relaxed">
                    Share your events, sell tickets, and reach thousands of fans with ease.
                </p>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full lg:w-7/12 p-8 md:p-12 bg-black/40 relative">
                <div className="max-w-xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                           Create Organizer Account
                        </h1>
                         <p className="text-gray-400 text-sm">
                            Join thousands of hosts managing events on Passket
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center">
                            <span className="mr-2">⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label
                                    htmlFor="firstName"
                                    className="text-xs uppercase tracking-wider text-gray-400 font-semibold ml-1"
                                >
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    required
                                    placeholder="John"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 outline-none"
                                />
                            </div>
                             <div className="space-y-2">
                                <label
                                    htmlFor="lastName"
                                    className="text-xs uppercase tracking-wider text-gray-400 font-semibold ml-1"
                                >
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Doe"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                             <label
                                htmlFor="email"
                                className="text-xs uppercase tracking-wider text-gray-400 font-semibold ml-1"
                              >
                                Email Address
                              </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="name@example.com"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-xs uppercase tracking-wider text-gray-400 font-semibold ml-1"
                              >
                                Password
                              </label>
                            <div className="relative group">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Create a strong password"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-4 pr-12 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                         <div className="space-y-2">
                            <label
                                htmlFor="confirmPassword"
                                className="text-xs uppercase tracking-wider text-gray-400 font-semibold ml-1"
                              >
                                Confirm Password
                              </label>
                            <div className="relative group">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Repeat your password"
                                    className={`w-full rounded-xl border ${
                                        isPasswordMismatch
                                          ? "border-red-500/50 bg-red-500/5 focus:border-red-500 focus:ring-red-500/20"
                                          : "border-white/10 bg-white/5 focus:border-purple-500 focus:bg-white/10 focus:ring-purple-500/20"
                                      } pl-4 pr-12 py-3 text-white placeholder-gray-500 focus:ring-2 transition-all duration-300 outline-none`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    {showConfirmPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                             {isPasswordMismatch && (
                                <p className="text-xs text-red-400 mt-1 ml-1 animate-pulse">
                                    Passwords do not match
                                </p>
                             )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || isPasswordMismatch}
                            className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                "Sign Up as an Organizer"
                            )}
                        </button>
                    </form>

                     <p className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="font-medium text-pink-400 hover:text-pink-300 hover:underline transition-colors"
                        >
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
