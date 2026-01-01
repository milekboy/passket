"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FiType, 
  FiAlignLeft, 
  FiCalendar, 
  FiMapPin, 
  FiGrid, 
  FiImage, 
  FiUploadCloud, 
  FiArrowLeft,
    FiArrowDown,
  FiX
} from "react-icons/fi";
import NetworkInstance from "../../Components/NetworkInstance";
import DashboardLayout from "../DashboardLayout";
import Toast from "../../Components/Toast";
import { useAuth } from "@/app/Components/AuthContext";

const categories = [
  "Party", "Family", "Faith", "Festival", "Theatre", 
  "Sports", "Comedy", "Music", "Tech", "Conference", "Workshop"
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
  const [dragActive, setDragActive] = useState(false);

  const showToast = (type, message) => setToast({ type, message });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      if (files && files[0]) setForm({ ...form, image: files[0] });
    } else if (name === "startDate" || name === "endDate") {
        if(value) setForm({ ...form, [name]: new Date(value).toISOString() });
        else setForm({ ...form, [name]: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
          setDragActive(true);
      } else if (e.type === "dragleave") {
          setDragActive(false);
      }
  };

  const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          setForm({ ...form, image: e.dataTransfer.files[0] });
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) return showToast("error", "Dates are required");
    
    setLoading(true);

    try {
      let imageUrl = "";

      // 1. Upload image to Cloudinary
      if (form.image) {
        const data = new FormData();
        data.append("file", form.image);
        data.append("upload_preset", "events"); 
        data.append("cloud_name", "dbpjskran"); 

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dbpjskran/image/upload",
          { method: "POST", body: data }
        );

        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.secure_url;
      }

      // 2. Send event data
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

      showToast("success", "Event created successfully!");
      
      // Delay slightly for effect
      setTimeout(() => {
          router.push(`/dashboard/admin-event/${res.data.id}`);
      }, 1000);

    } catch (err) {
      console.error("API Error:", err);
      showToast("error", err?.response?.data?.message || "Failed to create event.");
      setLoading(false); // Only stop loading on error, let it stay for success redirect
    } 
  };
  
  // Helper to convert ISO back to local input string
  const toLocalInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 16) : "");

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
             <div>
                <Link 
                    href="/dashboard/admin-all-events"
                    className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-2 cursor-pointer"
                >
                    <FiArrowLeft /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Create New Event</h1>
                <p className="text-white/60 mt-1">Fill in the details to launch your next big experience.</p>
             </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Form Area */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Basic Info Card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition focus-within:border-white/20">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <FiType className="text-pink-500"/> Basic Details
                    </h3>
                    
                    <div className="space-y-5">
                        <div className="group">
                             <label className="block text-xs font-semibold uppercase text-white/60 mb-2">Event Title</label>
                             <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Summer Music Festival 2026"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent outline-none transition"
                             />
                        </div>
                        
                         <div className="group">
                             <label className="block text-xs font-semibold uppercase text-white/60 mb-2">Description</label>
                             <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                rows="5"
                                placeholder="Tell people what makes your event special..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent outline-none transition resize-none"
                             />
                        </div>
                    </div>
                </div>

                {/* Date & Location Card */}
                 <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition focus-within:border-white/20">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <FiCalendar className="text-yellow-500"/> Logistics
                    </h3>

                    <div className="grid gap-5 sm:grid-cols-2">
                         <div>
                             <label className="block text-xs font-semibold uppercase text-white/60 mb-2">Start Date</label>
                             <input
                                type="datetime-local"
                                name="startDate"
                                value={toLocalInput(form.startDate)}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-pink-500/50 outline-none transition [color-scheme:dark]"
                             />
                        </div>
                         <div>
                             <label className="block text-xs font-semibold uppercase text-white/60 mb-2">End Date</label>
                             <input
                                type="datetime-local"
                                name="endDate"
                                value={toLocalInput(form.endDate)}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-pink-500/50 outline-none transition [color-scheme:dark]"
                             />
                        </div>
                        
                         <div className="sm:col-span-2">
                             <label className="block text-xs font-semibold uppercase text-white/60 mb-2">Location</label>
                             <div className="relative">
                                 <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                 <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="Venue name or Address"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/20 focus:ring-2 focus:ring-pink-500/50 outline-none transition"
                                 />
                             </div>
                        </div>
                    </div>
                 </div>

            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                
                {/* Category Card */}
                 <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FiGrid className="text-blue-400"/> Category
                    </h3>
                    <div className="relative">
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          required
                          className="w-full appearance-none bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-pink-500/50 outline-none transition cursor-pointer"
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                          <FiArrowDown />
                        </div>
                    </div>
                </div>

                {/* Image Upload Card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                     <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FiImage className="text-purple-400"/> Cover Image
                    </h3>
                    
                    {!form.image ? (
                        <div 
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                                dragActive 
                                ? "border-pink-500 bg-pink-500/10" 
                                : "border-white/10 hover:border-white/30 hover:bg-white/5"
                            }`}
                        >
                             <FiUploadCloud className={`text-4xl mb-3 ${dragActive ? "text-pink-400" : "text-white/40"}`} />
                             <p className="text-sm font-medium text-white/80">
                                 Drag & Drop image here
                             </p>
                             <p className="text-xs text-white/40 mt-1 mb-4">or click to browse</p>
                             <label className="cursor-pointer bg-white/10 border border-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2 text-sm transition">
                                 Choose File
                                 <input type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
                             </label>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-xl border border-white/10 group">
                             <img 
                                src={URL.createObjectURL(form.image)} 
                                alt="Preview" 
                                className="w-full h-48 object-cover"
                             />
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <button 
                                    type="button"
                                    onClick={() => setForm({...form, image: null})}
                                    className="cursor-pointer bg-red-500/20 text-red-200 border border-red-500/50 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm hover:bg-red-500/40 transition"
                                 >
                                    <FiX /> Remove
                                 </button>
                             </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2">
                     <button
                        type="submit"
                        disabled={loading}
                        className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-pink-600 via-yellow-500 to-pink-600 bg-size-200 hover:bg-pos-100 px-6 py-4 font-bold text-black shadow-lg shadow-pink-600/20 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? "Creating your event..." : "Create Event & Continue →"}
                    </button>
                    <p className="text-xs text-center text-white/30 mt-3">
                        You'll be able to add tickets in the next step.
                    </p>
                </div>

            </div>

        </form>

        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: "", message: "" })}
        />
      </div>
    </DashboardLayout>
  );
}
