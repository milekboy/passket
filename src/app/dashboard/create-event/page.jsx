"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NetworkInstance from "../../Components/NetworkInstance";
import DashboardLayout from "../DashboardLayout";
import Toast from "../../Components/Toast";
import { useAuth } from "@/app/Components/AuthContext";
const categories = [
  "Party",
  "Family",
  "Faith",
  "Festival",
  "Theatre",
  "Sports",
  "Comedy",
  "Music",
  "Tech",
];

export default function CreateEventPage() {
  const router = useRouter();
  const api = NetworkInstance();
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    category: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else if (name === "startDate" || name === "endDate") {
      const newValue = new Date(value).toISOString(); // ensure full ISO
      setForm({ ...form, [name]: newValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      // ✅ 1. Upload image to Cloudinary if selected
      if (form.image) {
        const data = new FormData();
        data.append("file", form.image);
        data.append("upload_preset", "events"); // your preset name
        data.append("cloud_name", "dbpjskran"); // your Cloudinary cloud name

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dbpjskran/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const uploadData = await uploadRes.json();

        if (uploadData.secure_url) {
          imageUrl = uploadData.secure_url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      // ✅ 2. Send event data to your backend
      const payload = {
        title: form.title,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        location: form.location,
        category: form.category,
        isPublic: true,
        isPublished: false,
        status: "Draft",
        imageUrl,
      };

      const res = await api.post("/Event", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Event created:", res.data);

      setForm({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        category: "",
        image: null,
      });

      showToast("success", "Event created successfully!");
      router.push(`/dashboard/admin-event/${res.data.id}`);
    } catch (err) {
      console.error("❌ API Error:", err);
      showToast(
        "error",
        err?.response?.data?.message || "Failed to create event."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <section className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-extrabold text-white mb-6">
          Create Event
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/80">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/80">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="4"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
            />
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white/80">
                Start Date
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={form.startDate ? form.startDate.slice(0, 16) : ""}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80">
                End Date
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={form.endDate ? form.endDate.slice(0, 16) : ""}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-white/80">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-white/80">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-white focus:border-yellow-400 focus:ring focus:ring-yellow-400/40"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white/80">
              Event Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-pink-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-110 cursor-pointer"
            />

            {form.image && (
              <div className="mt-4 flex items-center gap-4">
                {/* Image Preview */}
                <div className="relative h-24 w-32 overflow-hidden rounded-lg border border-white/10">
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Event Preview"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Details + Remove Button */}
                <div className="flex flex-col">
                  <p className="text-xs text-white/70">{form.image.name}</p>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: null })}
                    className="mt-2 w-fit rounded-lg bg-red-500/20 px-3 py-1 text-xs cursor-pointer font-semibold text-red-300 hover:bg-red-500/30"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer transform rounded-lg bg-gradient-to-r from-pink-600 via-yellow-400 to-pink-600 px-4 py-2 font-semibold text-black shadow-md transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>

        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: "", message: "" })}
        />
      </section>
    </DashboardLayout>
  );
}
