"use client";
import { useAuth } from "../Components/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NetworkInstance from "../Components/NetworkInstance";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import LoadingTicket from "../Components/LoadingTicket";
import { TicketIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"; // heroicons for excitement

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const networkInstance = NetworkInstance();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
      // 1. Login
      const res = await networkInstance.post("/User/login", form);
      const token = res.data.token;

      // 2. Get user details
      const me = await networkInstance.get("/User/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("User:", me.data);

      // 3. Save user + token in context
      login({ user: me.data, token });

      // 4. Redirect
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
      <main className="relative flex min-h-screen items-center justify-center bg-[#0a0a0a] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/20 blur-[120px] animate-pulse delay-1000" />
        
        <div className="relative z-10 w-full max-w-5xl mx-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row">
            {/* Left Side - Visual */}
            <div className="relative w-full md:w-1/2 p-12 flex flex-col items-center justify-center text-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-pink-600/90 z-0 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay" />
                
                {/* Floating Icons/Shapes */}
                <div className="relative z-10 mb-8 transform transition-transform duration-700 hover:scale-110 hover:rotate-3">
                   <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
                   <TicketIcon className="w-32 h-32 text-white drop-shadow-2xl relative z-10" />
                </div>
                
                <h2 className="relative z-10 text-4xl font-bold text-white mb-4 tracking-tight">
                    Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">Hypest</span> Events
                </h2>
                <p className="relative z-10 text-purple-100 text-lg max-w-sm leading-relaxed">
                    Your all-in-one platform to create, manage, and discover the most electrifying events in town.
                </p>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 bg-black/40 relative">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                           Welcome Back
                        </h1>
                         <p className="text-gray-400 text-sm">
                            Enter your credentials to access your dashboard
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center">
                            <span className="mr-2">⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    placeholder="••••••••"
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </span>
                            ) : (
                                "Sign In to Dashboard"
                            )}
                        </button>
                    </form>

                     <p className="mt-8 text-center text-sm text-gray-400">
                        New to Passket?{" "}
                        <a
                            href="/signup"
                            className="font-medium text-pink-400 hover:text-pink-300 hover:underline transition-colors"
                        >
                            Create an account
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
