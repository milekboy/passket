"use client";

import { useState } from "react";
import Toast from "./Toast";
export default function CheckoutForm({ onBack, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    confirmEmail: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null); // { type, message }

  const handleChange = (e) => {
    if (isLoading) return; // Prevent edits while loading
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    // Check for mismatch but DO NOT set inline error, use Toast instead
    if (formData.email !== formData.confirmEmail) {
       // We'll return false here but handle the UI via Toast
       setToast({ type: "error", message: "Emails do not match!" });
       return false; 
    }
    
  
    
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    // If we have field errors, return false. 
    // The mismatch check above already returned false if triggered.
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <h3 className="mb-4 text-lg font-semibold text-white">Customer Details</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="mb-1 block text-sm text-white/70">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            className={`w-full rounded-xl border bg-black/20 px-4 py-3 text-white placeholder-white/30 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 disabled:opacity-50 ${
              errors.fullName ? "border-red-500" : "border-white/10"
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm text-white/70">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`w-full rounded-xl border bg-black/20 px-4 py-3 text-white placeholder-white/30 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 disabled:opacity-50 ${
              errors.email ? "border-red-500" : "border-white/10"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Confirm Email */}
        <div>
          <label className="mb-1 block text-sm text-white/70">Confirm Email</label>
          <input
            type="email"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            placeholder="Re-enter email"
            className={`w-full rounded-xl border bg-black/20 px-4 py-3 text-white placeholder-white/30 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 disabled:opacity-50 ${
              // No inline error border for mismatch, maybe for empty? 
              // Leaving generic border-white/10 for now as styling wasn't explicitly requested to change logic
              "border-white/10"
            }`}
          />
          {/* No inline error message for confirmEmail */}
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1 block text-sm text-white/70">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            maxLength={11}
            onChange={handleChange}
            placeholder="080********"
            className={`w-full rounded-xl border bg-black/20 px-4 py-3 text-white placeholder-white/30 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 disabled:opacity-50 ${
              errors.phone ? "border-red-500" : "border-white/10"
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex-1 cursor-pointer rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back to tickets
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 cursor-pointer rounded-xl bg-pink-600 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
