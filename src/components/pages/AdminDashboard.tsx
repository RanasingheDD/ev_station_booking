import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; 
import { 
  Users, Zap, DollarSign, Activity, Menu, X, Plus, Trash2, AlertTriangle, MapPin, MessageSquare, Calendar, Search, Coins // 👈 Added Coins Icon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  fetchAdminStats, fetchAllUsers, registerOwner, fetchAllStations, 
  fetchDeleteRequests, confirmStationDelete, rejectStationDelete,
  fetchMessages, deleteMessage 
} from "../../services/admin_service";

// --- 🎨 THEME: SLATE & ROSE (CRIMSON AUTHORITY) ---
const styles = {
  pageBg: "bg-[#020617]", 
  cardBg: "bg-[#0f172a]", 
  sidebarBg: "bg-[#0B0F19]",
  
  buttonPrimary: "px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-900/20 font-medium flex items-center gap-2",
  buttonDanger: "px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2",
  buttonSuccess: "px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center gap-2",
  buttonReview: "px-3 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg hover:bg-indigo-500 hover:text-white transition-colors flex items-center justify-center gap-2",
  
  input: "w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-rose-500/50 outline-none transition-all placeholder-slate-500",
  label: "block text-sm font-medium text-slate-400 mb-1",
  detailRow: "flex justify-between border-b border-slate-800 py-2 last:border-0",
};

// ... [AdminMap Component - No Changes] ...
const AdminMap = ({ stations }: { stations: any[] }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([7.8731, 80.7718], 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    }
    const map = mapInstanceRef.current;
    map.eachLayer((layer) => { if (layer instanceof L.CircleMarker || layer instanceof L.Marker) map.removeLayer(layer); });

    if (stations && stations.length > 0) {
      const group = L.featureGroup();
      stations.forEach((station) => {
        if (station.lat && station.lng) {
          const color = station.isOpen ? "#10b981" : "#ef4444";
          const marker = L.circleMarker([station.lat, station.lng], { radius: 8, fillColor: color, color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.8 }).addTo(map);
          marker.bindPopup(`<div style="font-family: sans-serif; color: #333;"><strong>${station.name}</strong><br/>${station.address}<br/><span style="color: ${color}; font-weight: bold;">${station.isOpen ? "● Open" : "● Closed"}</span></div>`);
          marker.addTo(group);
        }
      });
      if (group.getLayers().length > 0) map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }, [stations]);
  return <div ref={mapContainerRef} className="w-full h-full rounded-xl z-0" style={{ filter: "brightness(0.9) contrast(1.1) saturate(0.8)" }} />;
};

// ... [StationReviewModal Component - No Changes] ...
const StationReviewModal = ({ station, onClose, onConfirm, onReject }: any) => {
  if (!station) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className={`${styles.cardBg} border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-[#0f172a] z-10">
          <div><h3 className="text-xl font-bold text-white flex items-center gap-2"><AlertTriangle className="text-rose-500" size={24} /> Review Request</h3><p className="text-slate-400 text-sm mt-1">Station: <span className="text-white font-medium">{station.name}</span></p></div>
          <button onClick={onClose} title="Close Modal" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img src={station.images?.[0] || "https://via.placeholder.com/300"} alt="Station" className="w-full md:w-1/3 h-40 object-cover rounded-xl border border-slate-700 shadow-md"/>
            <div className="flex-1 space-y-3">
               <div className={styles.detailRow}><span className="text-slate-500">Status</span><span className={station.isOpen ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{station.isOpen ? "Open" : "Closed"}</span></div>
               <div className={styles.detailRow}><span className="text-slate-500">Rating</span><span className="text-amber-400 font-bold">★ {station.rating || "N/A"}</span></div>
               <div className={styles.detailRow}><span className="text-slate-500">Total Bookings</span><span className="text-white font-medium">{station.reviewCount || 0}</span></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
              <h4 className="text-rose-400 font-bold mb-2 flex items-center gap-2 text-xs uppercase tracking-wide"><Users size={14}/> Owner</h4>
              <p className="text-white text-sm">{station.operatorName || "Unknown"}</p>
              <p className="text-slate-500 text-xs font-mono mt-1">{station.operatorId}</p>
            </div>
            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
              <h4 className="text-rose-400 font-bold mb-2 flex items-center gap-2 text-xs uppercase tracking-wide"><MapPin size={14}/> Location</h4>
              <p className="text-white text-sm">{station.address}</p>
              <a href={`http://maps.google.com/?q=${station.lat},${station.lng}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline text-xs block mt-2">View on Map →</a>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl sticky bottom-0">
          <div className="flex gap-4">
             <button onClick={onReject} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-medium">Reject</button>
             <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-medium shadow-lg shadow-rose-900/20">Confirm Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 3. MAIN DASHBOARD
// ----------------------------------------------------------------------
export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const [ ,setLoading] = useState(false);

  // Data States
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [deleteRequests, setDeleteRequests] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Filters & Modals
  const [userFilter, setUserFilter] = useState("ALL");
  const [userSearch, setUserSearch] = useState("");
  const [stationSearch, setStationSearch] = useState("");
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [newOwner, setNewOwner] = useState({ name: "", email: "", password: "", mobile: "" });
  const [reviewStation, setReviewStation] = useState<any>(null);

  useEffect(() => { fetchInitialData(); }, []);

  useEffect(() => {
    loadTabData();
    if (activeTab === "messages") setUnreadCount(0);
  }, [activeTab]);

  const fetchInitialData = async () => {
    try {
      const msgs = await fetchMessages();
      setUnreadCount(msgs ? msgs.length : 0);
    } catch (e) { console.error("Background fetch failed", e); }
  };

  const loadTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        const [statsData, stationData] = await Promise.all([fetchAdminStats(), fetchAllStations()]);
        setStats(statsData || {});
        setStations(stationData || []);
      } else if (activeTab === "users") {
        const data = await fetchAllUsers();
        setUsers(data || []);
      } else if (activeTab === "stations") {
        const [allStations, requests] = await Promise.all([fetchAllStations(), fetchDeleteRequests()]);
        setStations(allStations || []);
        setDeleteRequests(requests || []);
      } else if (activeTab === "messages") {
        const data = await fetchMessages();
        setMessages(data || []);
      }
    } catch (error) { console.error("Error loading tab data:", error); } 
    finally { setLoading(false); }
  };

  // Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesRole = userFilter === "ALL" || user.role === userFilter;
    const matchesSearch = (user.name?.toLowerCase() || "").includes(userSearch.toLowerCase()) || (user.email?.toLowerCase() || "").includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const filteredStations = stations.filter(station => {
    return (station.name?.toLowerCase() || "").includes(stationSearch.toLowerCase()) || (station.address?.toLowerCase() || "").includes(stationSearch.toLowerCase());
  });

  // Handlers
  const handleRegisterOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerOwner(newOwner);
      alert("Owner registered!");
      setShowOwnerModal(false);
      setNewOwner({ name: "", email: "", password: "", mobile: "" });
      loadTabData();
    } catch (error) { alert("Failed. Email might exist."); }
  };

  const handleConfirmDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this station?")) return;
    await confirmStationDelete(id);
    setReviewStation(null);
    loadTabData();
  };

  const handleDeleteMessage = async (id: string) => {
    if(!window.confirm("Delete this message?")) return;
    await deleteMessage(id);
    loadTabData();
  }

  const handleLogout = () => {
    if (window.confirm("Logout?")) { localStorage.removeItem("token"); navigate("/login"); }
  };

  return (
    <div className={`min-h-screen ${styles.pageBg} text-white flex font-sans selection:bg-rose-500/30`}>
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} ${styles.sidebarBg} border-r border-slate-800 transition-all duration-300 flex flex-col fixed h-full z-20`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold text-rose-500 flex items-center gap-2 tracking-wide"><Activity/> ADMIN</h1>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Toggle Sidebar" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><Menu size={20} /></button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={Activity} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} isOpen={isSidebarOpen} />
          <SidebarItem icon={Users} label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} isOpen={isSidebarOpen} />
          <SidebarItem icon={Zap} label="Stations" active={activeTab === "stations"} onClick={() => setActiveTab("stations")} isOpen={isSidebarOpen} />
          <SidebarItem icon={MessageSquare} label="Messages" active={activeTab === "messages"} onClick={() => setActiveTab("messages")} isOpen={isSidebarOpen} badge={unreadCount > 0 ? unreadCount : null} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
             {isSidebarOpen ? "Logout" : <X size={20} />}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white capitalize tracking-tight">{activeTab}</h2>
          <p className="text-slate-400 text-sm mt-1">Manage platform activity and resources</p>
        </header>

        {/* 1. OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers || 0} color="text-blue-400" bg="bg-blue-500/10" />
              <StatCard icon={Zap} label="Total Stations" value={stats.totalStations || 0} color="text-yellow-400" bg="bg-yellow-500/10" />
              <StatCard icon={DollarSign} label="Revenue" value={`LKR ${stats.totalRevenue || 0}`} color="text-emerald-400" bg="bg-emerald-500/10" />
              <StatCard icon={AlertTriangle} label="Pending Requests" value={stats.pendingApprovals || 0} color="text-rose-400" bg="bg-rose-500/10" />
            </div>
            <div className={`${styles.cardBg} border border-slate-800 rounded-xl p-1 h-[500px] shadow-2xl relative overflow-hidden ring-1 ring-white/5`}>
              <AdminMap stations={stations} />
              <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-700 p-3 rounded-lg z-[400] text-xs shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2 mb-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span> Active</div>
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span> Closed</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. USERS TAB (UPDATED WITH POINTS) */}
        {activeTab === "users" && (
          <div className={`${styles.cardBg} border border-slate-800 rounded-xl p-6 shadow-xl`}>
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">User Management</h3>
              <button onClick={() => setShowOwnerModal(true)} className={styles.buttonPrimary}><Plus size={18}/> Add Owner</button>
            </div>
            <div className="flex gap-4 mb-6">
              <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                {['ALL', 'OWNER', 'USER', 'ADMIN'].map(role => (
                  <button key={role} onClick={() => setUserFilter(role)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${userFilter === role ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>{role === 'USER'?'Users':role==='ALL'?'All':role.charAt(0)+role.slice(1).toLowerCase()+'s'}</button>
                ))}
              </div>
              <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} /><input placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-1 focus:ring-rose-500 outline-none text-sm"/></div>
            </div>
            
            {/* --- USER TABLE WITH POINTS --- */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800 text-xs uppercase tracking-wider">
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Points</th> {/* 👈 Added Header */}
                  <th className="p-4">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-800/50 transition-colors border-b border-slate-800 last:border-0">
                    <td className="p-4"><div className="font-medium text-white">{u.name}</div><div className="text-sm text-slate-500">{u.email}</div></td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${u.role === "ADMIN" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : u.role === "OWNER" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>{u.role}</span></td>
                    
                    {/* 👈 POINTS COLUMN */}
                    <td className="p-4">
                        {u.role === "USER" ? (
                        <div className="flex items-center gap-2 bg-amber-500/10 w-fit px-2 py-1 rounded-lg border border-amber-500/20">
                            <Coins size={14} className="text-amber-400" />
                            <span className="text-amber-400 font-mono font-bold">{u.points || 0}</span>
                        </div>
                    ) : (
                        <span className="text-slate-600 pl-4">-</span>
                    )}
                    </td>
                    <td className="p-4 text-slate-400 text-sm font-mono">{u.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. STATIONS */}
        {activeTab === "stations" && (
          <div className="space-y-8">
            {deleteRequests.length > 0 && (
              <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
                <div className="flex items-center gap-3 mb-4 text-rose-400"><AlertTriangle /><h3 className="text-xl font-bold">Delete Requests ({deleteRequests.length})</h3></div>
                <div className="grid gap-4">
                  {deleteRequests.map((req) => (
                    <div key={req.id} className="bg-slate-900 p-4 rounded-xl flex justify-between items-center border border-slate-800 hover:border-rose-500/30 transition-colors">
                      <div><h4 className="font-bold text-white text-lg">{req.name}</h4><p className="text-sm text-slate-400 mt-1"><MapPin size={14} className="inline mr-1 text-rose-500"/> {req.address}</p></div>
                      <div className="flex gap-2">
                        <button onClick={() => setReviewStation(req)} className={styles.buttonReview}>Review</button>
                        <button onClick={() => rejectStationDelete(req.id).then(loadTabData)} className={styles.buttonSuccess}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className={`${styles.cardBg} border border-slate-800 rounded-xl p-6 shadow-xl`}>
              <div className="flex justify-between mb-6">
                <h3 className="text-xl font-bold">All Active Stations</h3>
                <div className="relative w-72"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} /><input placeholder="Search stations..." value={stationSearch} onChange={e => setStationSearch(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-1 focus:ring-rose-500 outline-none text-sm"/></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredStations.map((s) => (
                  <div key={s.id} className="bg-slate-800/40 border border-slate-700 rounded-xl p-5 hover:border-rose-500/30 transition-colors group">
                    <div className="flex justify-between mb-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:text-rose-400 group-hover:bg-rose-500/10 transition-colors"><Zap size={20}/></div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border h-fit ${s.isOpen ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{s.isOpen ? "Open" : "Closed"}</span>
                    </div>
                    <h4 className="font-bold text-white truncate text-lg mb-1">{s.name}</h4>
                    <p className="text-slate-400 text-sm truncate flex items-center gap-1"><MapPin size={14} className="text-slate-600"/>{s.address}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. MESSAGES */}
        {activeTab === "messages" && (
          <div className={`${styles.cardBg} border border-slate-800 rounded-xl p-6 shadow-xl`}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><MessageSquare className="text-rose-500"/> User Inquiries</h3>
            {messages.length === 0 ? <div className="text-center py-10 text-slate-500">No new messages.</div> : (
              <div className="grid gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-slate-800/30 border border-slate-800 p-5 rounded-xl hover:border-indigo-500/30 transition-all group relative">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold uppercase">{msg.name.charAt(0)}</div>
                        <div><h4 className="font-bold text-white">{msg.name}</h4><p className="text-xs text-indigo-400">{msg.email}</p></div>
                      </div>
                      <button onClick={() => handleDeleteMessage(msg.id)} title="Delete Message" className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                    <p className="text-slate-300 bg-slate-900/50 p-4 rounded-lg text-sm leading-relaxed border border-slate-800/50">{msg.message}</p>
                    <div className="mt-3 text-right text-xs text-slate-500 flex justify-end items-center gap-1 font-mono"><Calendar size={12}/> {new Date(msg.timestamp).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Owner Modal */}
      {showOwnerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${styles.cardBg} border border-slate-700 rounded-2xl w-full max-w-md p-8 relative shadow-2xl`}>
             <button onClick={()=>setShowOwnerModal(false)} title="Close Modal" className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
            <h3 className="text-xl font-bold text-white mb-6">New Owner Account</h3>
            <form onSubmit={handleRegisterOwner} className="space-y-4">
              <input type="text" placeholder="Full Name" required className={styles.input} value={newOwner.name} onChange={e=>setNewOwner({...newOwner, name:e.target.value})}/>
              <input type="email" placeholder="Email Address" required className={styles.input} value={newOwner.email} onChange={e=>setNewOwner({...newOwner, email:e.target.value})}/>
              <input type="text" placeholder="Mobile Number" required className={styles.input} value={newOwner.mobile} onChange={e=>setNewOwner({...newOwner, mobile:e.target.value})}/>
              <input type="password" placeholder="Password" required className={styles.input} value={newOwner.password} onChange={e=>setNewOwner({...newOwner, password:e.target.value})}/>
              <button type="submit" className={`${styles.buttonPrimary} w-full justify-center mt-4`}>Create Account</button>
            </form>
          </div>
        </div>
      )}

      <StationReviewModal station={reviewStation} onClose={() => setReviewStation(null)} onConfirm={() => handleConfirmDelete(reviewStation.id)} onReject={() => { rejectStationDelete(reviewStation.id); setReviewStation(null); loadTabData(); }} />
    </div>
  );
}

// ----------------------------------------------------------------------
// HELPER COMPONENTS
// ----------------------------------------------------------------------

const StatCard = ({ icon: Icon, label, value, color, bg }: any) => (
  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-center hover:border-slate-700 transition-colors shadow-lg">
    <div className={`p-4 rounded-xl ${bg} ${color} mr-4`}><Icon size={24} /></div>
    <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p><p className="text-2xl font-bold text-white tracking-tight">{value}</p></div>
  </div>
);

function SidebarItem({ icon: Icon, label, active, onClick, isOpen, badge }: any) {
  return (
    <button onClick={onClick} title={label} className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 relative ${active ? "bg-rose-600/10 text-rose-400 border border-rose-600/20 shadow-sm" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}>
      <Icon size={20} className={isOpen ? "mr-3" : "mx-auto"} /> 
      {isOpen && <span className="font-medium">{label}</span>}
      
      {/* 🔴 NOTIFICATION BADGE */}
      {badge && (
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-rose-900/50 ${!isOpen ? "right-0 top-0 translate-y-0 translate-x-1/4" : ""}`}>
          {badge}
        </span>
      )}
    </button>
  );
}