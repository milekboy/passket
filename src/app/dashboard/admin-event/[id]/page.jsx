"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiMapPin, 
  FiDollarSign, 
  FiUsers, 
  FiTag, 
  FiGlobe, 
  FiMoreHorizontal, 
  FiTrash2, 
  FiPlus,
  FiCheck,
  FiX,
  FiEdit3
} from "react-icons/fi";
import DashboardLayout from "../../DashboardLayout";
import NetworkInstance from "../../../Components/NetworkInstance";
import Toast from "../../../Components/Toast";
import { useAuth } from "@/app/Components/AuthContext";

/* --- Utils --- */
const fmtMoney = (n, c = "NGN") =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: c }).format(n);

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
};

const toISOZ = (local) => (local ? new Date(local).toISOString() : null);
const toLocalInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 16) : "");

export default function EventDetailPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const api = NetworkInstance();
  const { token } = useAuth();
  
  const [tab, setTab] = useState("overview"); // "overview" | "tickets" | "edit" | "settings"
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => setToast({ type, message });

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Event/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const list = res?.data?.events ?? res?.data?.data ?? (Array.isArray(res?.data) ? res.data : []) ?? [];
      const found = list.find((e) => e.id === id);

      if (!found) {
        setEvent(null);
        showToast("error", "Event not found.");
      } else {
        setEvent(found);
        setTickets(found.ticketTiers || []);
      }
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to load event details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && token) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  /* --- Derived Stats --- */
  const stats = useMemo(() => {
    if (!tickets.length) return { revenue: 0, sold: 0, total: 0 };
    return tickets.reduce(
      (acc, t) => {
        const sold = t.soldQuantity || 0;
        const price = t.price || 0;
        acc.sold += sold;
        acc.revenue += sold * price;
        acc.total += t.maxQuantity || 0;
        return acc;
      },
      { revenue: 0, sold: 0, total: 0 }
    );
  }, [tickets]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center text-white/50 animate-pulse">
          Loading event details...
        </div>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-4xl p-6 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12">
            <h2 className="text-xl font-bold text-white">Event Not Found</h2>
            <Link href="/dashboard/admin-all-events" className="mt-4 inline-block text-pink-400 hover:underline">
              Return to Events
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 pb-12">
        
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Link 
              href="/dashboard/admin-all-events"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-3 cursor-pointer"
            >
              <FiArrowLeft /> Back to Events
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{event.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><FiCalendar className="text-pink-500"/> {formatDate(event.startDate)}</span>
              <span className="flex items-center gap-1.5"><FiMapPin className="text-yellow-500"/> {event.location || "Online"}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                event.status === "Published" 
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" 
                  : "border-white/10 bg-white/5 text-white/60"
              }`}>
                {event.status || "Draft"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setTab("tickets")}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-pink-600/20"
            >
              <FiPlus /> Add Ticket
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="border-b border-white/10">
          <nav className="flex gap-6">
            {["overview", "tickets", "edit", "settings"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`cursor-pointer pb-3 text-sm font-medium transition-all relative ${
                  tab === t ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {tab === t && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-pink-500 to-yellow-500" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {tab === "overview" && (
            <OverviewTab event={event} stats={stats} tickets={tickets} />
          )}
          {tab === "tickets" && (
            <TicketsTab 
              eventId={event.id} 
              tickets={tickets} 
              onUpdate={fetchAll} 
              showToast={showToast} 
            />
          )}
          {tab === "edit" && (
            <EditTab 
              event={event} 
              onUpdate={fetchAll} 
              showToast={showToast} 
            />
          )}
          {tab === "settings" && (
            <SettingsTab 
              event={event} 
              onUpdate={fetchAll} 
              showToast={showToast} 
            />
          )}
        </main>

      </div>
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />
    </DashboardLayout>
  );
}

/* --- Components --- */

function OverviewTab({ event, stats, tickets }) {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard 
          label="Total Revenue" 
          value={fmtMoney(stats.revenue)} 
          icon={<FiDollarSign className="text-xl text-green-400"/>} 
          sub="Gross ticket sales"
        />
        <StatCard 
          label="Tickets Sold" 
          value={stats.sold} 
          icon={<FiTag className="text-xl text-blue-400"/>} 
          sub={`${stats.total > 0 ? ((stats.sold / stats.total) * 100).toFixed(1) : 0}% of capacity`}
        />
        <StatCard 
          label="Page Views" 
          value="-" 
          icon={<FiUsers className="text-xl text-purple-400"/>} 
          sub="Analytics coming soon"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="relative h-64 w-full bg-black/50">
               <img 
                src={event.imageUrl || "https://res.cloudinary.com/dbpjskran/image/upload/v1754989530/event_nrufbc.jpg"} 
                className="w-full h-full object-cover opacity-80"
                alt="Event cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{event.title}</h2>
                  <p className="text-white/80 line-clamp-2 max-w-2xl">{event.description}</p>
                </div>
              </div>
            </div>
            <div className="p-6 grid gap-6 sm:grid-cols-2 text-sm">
               <div>
                  <div className="text-white/40 uppercase text-xs font-bold mb-1">Start Date</div>
                  <div className="text-white">{formatDate(event.startDate)}</div>
               </div>
               <div>
                  <div className="text-white/40 uppercase text-xs font-bold mb-1">End Date</div>
                  <div className="text-white">{formatDate(event.endDate)}</div>
               </div>
               <div>
                  <div className="text-white/40 uppercase text-xs font-bold mb-1">Total Capacity</div>
                  <div className="text-white">{stats.total} Seats</div>
               </div>
               <div>
                  <div className="text-white/40 uppercase text-xs font-bold mb-1">Ticket Types</div>
                  <div className="text-white">{tickets.length} Tiers</div>
               </div>
            </div>
          </div>
        </div>

        {/* Ticket Breakdown Side Widget */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <FiTag /> Ticket Sales Breakdown
            </h3>
            {tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.map(t => (
                  <div key={t.id}>
                    <div className="flex justify-between text-sm text-white mb-1">
                      <span>{t.name}</span>
                      <span className="text-white/60">{t.soldQuantity} / {t.maxQuantity}</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-500 to-yellow-500" 
                        style={{ width: `${t.maxQuantity > 0 ? (t.soldQuantity / t.maxQuantity) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-white/40 italic">No tickets created yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, sub }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/[0.07]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/60 text-sm font-medium">{label}</span>
        <div className="p-2 rounded-lg bg-white/5 border border-white/5">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/40 mt-1">{sub}</div>
    </div>
  );
}

function TicketsTab({ eventId, tickets, onUpdate, showToast }) {
  const api = NetworkInstance();
  const { token } = useAuth();
  
  // State for adding ticket
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", maxQuantity: "", isAvailable: true
  });
  const [saving, setSaving] = useState(false);

  const handleDelete = async (ticketId) => {
    if(!confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await api.delete(`/events/${eventId}/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("success", "Ticket deleted");
      onUpdate();
    } catch (e) {
      showToast("error", "Failed to delete ticket");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.maxQuantity) return showToast("error", "Name and Quantity required");
    
    try {
      setSaving(true);
      await api.post(`/events/${eventId}/ticket-tiers`, {
        ...form,
        price: Number(form.price),
        maxQuantity: Number(form.maxQuantity),
        currency: "NGN",
        saleStartDate: new Date().toISOString(), // Default to now
        saleEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() // Default to 1 year
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showToast("success", "Ticket created successfully");
      setIsAdding(false);
      setForm({ name: "", description: "", price: "", maxQuantity: "", isAvailable: true });
      onUpdate();
    } catch (e) {
       console.error(e);
       showToast("error", e?.response?.data?.error || "Failed to create ticket");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      {/* Ticket List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">All Tickets</h3>
            <span className="text-sm text-white/50">{tickets.length} Types</span>
        </div>
        
        {tickets.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-white/20 rounded-2xl">
                <p className="text-white/50">No tickets found. Create your first one!</p>
            </div>
        ) : (
            tickets.map(t => (
                <div key={t.id} className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
                     <div className="flex justify-between items-start">
                         <div>
                             <h4 className="font-bold text-white text-lg">{t.name}</h4>
                             <p className="text-sm text-white/60 line-clamp-1">{t.description || "No description"}</p>
                             <div className="mt-2 flex items-center gap-3">
                                 <span className="text-pink-400 font-mono font-bold">{t.price > 0 ? fmtMoney(t.price) : "FREE"}</span>
                                 <span className={`text-xs px-2 py-0.5 rounded-full ${t.isAvailable ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                    {t.isAvailable ? "Active" : "Paused"}
                                 </span>
                             </div>
                         </div>
                         <div className="text-right">
                             <div className="text-2xl font-bold text-white">{t.soldQuantity}</div>
                             <div className="text-xs text-white/40 uppercase">Sold</div>
                         </div>
                     </div>
                     
                     <div className="mt-4">
                        <div className="flex justify-between text-xs text-white/50 mb-1">
                            <span>Progress</span>
                            <span>{Math.round((t.soldQuantity/t.maxQuantity)*100)}% of {t.maxQuantity}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full bg-pink-500" style={{ width: `${(t.soldQuantity/t.maxQuantity)*100}%` }} />
                        </div>
                     </div>

                     <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleDelete(t.id)} className="cursor-pointer p-2 rounded-full hover:bg-red-500/20 text-red-400">
                             <FiTrash2 />
                         </button>
                     </div>
                </div>
            ))
        )}
      </div>

      {/* Simplified Add Form */}
      <div>
         <div className="sticky top-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Add Ticket</h3>
            <form onSubmit={handleAdd} className="space-y-4">
                <div>
                    <label className="text-xs font-semibold text-white/60 uppercase">Name</label>
                    <input 
                        className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500/50 outline-none transition"
                        placeholder="e.g. VIP Access"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                    />
                </div>
                 <div>
                    <label className="text-xs font-semibold text-white/60 uppercase">Price</label>
                    <input 
                        type="number"
                        className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500/50 outline-none transition"
                        placeholder="0.00"
                        value={form.price}
                        onChange={e => setForm({...form, price: e.target.value})}
                    />
                </div>
                 <div>
                    <label className="text-xs font-semibold text-white/60 uppercase">Quantity</label>
                    <input 
                        type="number"
                        className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500/50 outline-none transition"
                        placeholder="100"
                        value={form.maxQuantity}
                        onChange={e => setForm({...form, maxQuantity: e.target.value})}
                    />
                </div>
                <button 
                    disabled={saving}
                    className="w-full mt-2 cursor-pointer bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
                >
                    {saving ? "Creating..." : "Create Ticket"}
                </button>
            </form>
         </div>
      </div>
    </div>
  );
}

function EditTab({ event, onUpdate, showToast }) {
  const api = NetworkInstance();
  const { token } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
      title: event.title || "",
      description: event.description || "",
      startDate: toLocalInput(event.startDate),
      endDate: toLocalInput(event.endDate),
      location: event.location || "",
      category: event.category || "",
      isPublic: event.isPublic ?? true,
      status: event.status || "Published",
      imageUrl: event.imageUrl || ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleUpdate = async (e) => {
      e.preventDefault();
      try {
          setLoading(true);
          
          // Construct payload explicitly to avoid sending unexpected fields
          const payload = {
              title: form.title,
              description: form.description,
              startDate: toISOZ(form.startDate),
              endDate: toISOZ(form.endDate),
              location: form.location,
              category: form.category,
              isPublic: Boolean(form.isPublic), // Ensure boolean
              status: form.status,
              imageUrl: form.imageUrl
          };
          
        

          await api.put(`/event/${event.id}`, payload, {
              headers: { Authorization: `Bearer ${token}` }
          });
          
          showToast("success", "Event updated successfully");
          onUpdate();
      } catch (e) {
          console.error("Update failed:", e);
          const errorMsg = e.response?.data?.title || 
                           e.response?.data?.message || 
                           (typeof e.response?.data === 'string' ? e.response?.data : "Failed to update event");
          showToast("error", errorMsg);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="max-w-3xl">
        <form onSubmit={handleUpdate} className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-bold text-white mb-6">Edit Event Details</h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
                 <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-white/70 mb-1">Event Title</label>
                    <input 
                        name="title" 
                        value={form.title} 
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500/50 outline-none"
                    />
                </div>
                
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
                    <textarea 
                        name="description" 
                        value={form.description} 
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500/50 outline-none resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Start Date</label>
                    <input 
                        type="datetime-local"
                        name="startDate" 
                        value={form.startDate} 
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500/50 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">End Date</label>
                    <input 
                         type="datetime-local"
                        name="endDate" 
                        value={form.endDate} 
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500/50 outline-none"
                    />
                </div>

                 <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Location</label>
                    <input 
                        name="location" 
                        value={form.location} 
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500/50 outline-none"
                    />
                </div>
                
                 <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
                    <input 
                        name="category" 
                        value={form.category} 
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500/50 outline-none"
                    />
                </div>
                
                 <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-white/70 mb-1">Image URL</label>
                    <input 
                        name="imageUrl" 
                        value={form.imageUrl} 
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500/50 outline-none"
                    />
                </div>

                <div className="flex items-center gap-3">
                     <input 
                        type="checkbox" 
                        name="isPublic"
                        id="isPublic"
                        checked={form.isPublic}
                        onChange={handleChange}
                        className="h-5 w-5 rounded border-white/20 bg-black/40 text-pink-600 focus:ring-pink-500/50"
                     />
                     <label htmlFor="isPublic" className="text-white">Make event public</label>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button 
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-pink-600 to-yellow-500 text-black font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50"
                >
                    {loading ? "Saving Changes..." : "Save Changes"}
                </button>
            </div>
        </form>
    </div>
  );
}

function SettingsTab({ event, onUpdate, showToast }) {
    const api = NetworkInstance();
    const { token } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const togglePublish = async () => {
        const action = event.status === "Published" ? "unpublish" : "publish";
         // Alert removed as per user request
         
         try {
             setLoading(true);
             await api.post(`/event/${event.id}/${action}`, {}, {
                 headers: { Authorization: `Bearer ${token}` }
             });
             showToast("success", `Event ${action}ed successfully`);
             onUpdate();
         } catch (e) {
             showToast("error", `Failed to ${action} event`);
             console.error(e);
         } finally {
             setLoading(false);
         }
    };

    const handleDeleteEvent = async () => {
         if(!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
         
         try {
            await api.delete(`/event/${event.id}`, {
               headers: { Authorization: `Bearer ${token}` }
            });
            showToast("success", "Event deleted successfully");
            router.push("/dashboard/admin-all-events");
         } catch (e) {
            console.error(e);
            showToast("error", "Failed to delete event");
         }
    };

    return (
        <div className="max-w-2xl space-y-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-bold text-white mb-2">Visibility</h3>
                <p className="text-sm text-white/60 mb-6">Control whether your event is visible to the public.</p>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5">
                    <div>
                        <div className="font-semibold text-white">{event.status === "Published" ? "Currently Live" : "Draft Mode"}</div>
                        <div className="text-xs text-white/50">{event.status === "Published" ? "Visible to everyone" : "Only visible to you"}</div>
                    </div>
                    <button 
                        onClick={togglePublish}
                        disabled={loading}
                        className={`cursor-pointer px-4 py-2 rounded-lg font-medium text-sm transition ${
                            event.status === "Published" 
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20" 
                            : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                        }`}
                    >
                       {loading ? "Processing..." : (event.status === "Published" ? "Unpublish Event" : "Publish Event")}
                    </button>
                </div>
            </div>

             <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-200/60 mb-6">Irreversible actions. Be careful.</p>
                
                 <button 
                  onClick={handleDeleteEvent}
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition text-sm"
                 >
                    <FiTrash2 /> Delete Event
                 </button>
            </div>
        </div>
    );
}
