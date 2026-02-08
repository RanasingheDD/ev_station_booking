import { useState, useEffect } from "react";
import { 
  Users, Zap, DollarSign, Activity, Menu, X, Plus, Trash2, CheckCircle, XCircle, AlertTriangle, MapPin, MessageSquare, Calendar, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  fetchAdminStats, fetchAllUsers, registerOwner, fetchAllStations, 
  fetchDeleteRequests, confirmStationDelete, rejectStationDelete,
  fetchMessages, deleteMessage 
} from "../../services/admin_service";

// --- STYLES ---
const styles = {
  pageBg: "bg-slate-950",
  cardBg: "bg-slate-900",
  buttonPrimary: "px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg font-medium",
  buttonDanger: "px-3 py-1 bg-red-600/10 text-red-400 border border-red-600/20 rounded-lg hover:bg-red-600 hover:text-white transition-colors",
  buttonSuccess: "px-3 py-1 bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors",
  buttonReview: "px-3 py-1 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-lg hover:bg-blue-600 hover:text-white transition-colors",
  input: "w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-slate-500",
  label: "block text-sm font-medium text-slate-400 mb-1",
  detailRow: "flex justify-between border-b border-slate-800 py-2 last:border-0",
};

// ----------------------------------------------------------------------
// 1. REVIEW STATION MODAL
// ----------------------------------------------------------------------
const StationReviewModal = ({ station, onClose, onConfirm, onReject }: any) => {
  if (!station) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${styles.cardBg} border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="text-red-400" size={24} /> 
              Review Deletion Request
            </h3>
            <p className="text-slate-400 text-sm">Station: {station.name}</p>
          </div>
          <button onClick={onClose} title="Close" className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* 1. Station Image & Overview */}
          <div className="flex flex-col md:flex-row gap-6">
            <img 
              src={station.images?.[0] || "https://via.placeholder.com/300"} 
              alt="Station" 
              className="w-full md:w-1/3 h-40 object-cover rounded-xl border border-slate-700"
            />
            <div className="flex-1 space-y-3">
               <div className={styles.detailRow}>
                 <span className="text-slate-500">Status</span>
                 <span className={station.isOpen ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                   {station.isOpen ? "Open" : "Closed"}
                 </span>
               </div>
               <div className={styles.detailRow}>
                 <span className="text-slate-500">Rating</span>
                 <span className="text-amber-400 font-bold">★ {station.rating || "N/A"}</span>
               </div>
               <div className={styles.detailRow}>
                 <span className="text-slate-500">Total Bookings</span>
                 <span className="text-white font-medium">{station.reviewCount || 0} (approx)</span>
               </div>
            </div>
          </div>

          {/* 2. Owner & Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h4 className="text-indigo-400 font-bold mb-3 flex items-center gap-2"><Users size={18}/> Owner Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-slate-500">Name:</span> <span className="text-white">{station.operatorName || "Unknown"}</span></p>
                <p><span className="text-slate-500">ID:</span> <span className="text-slate-400 font-mono text-xs">{station.operatorId}</span></p>
                {/* Note: Contact info would need to be fetched separately if not in StationModel, usually operatorName is available */}
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h4 className="text-indigo-400 font-bold mb-3 flex items-center gap-2"><MapPin size={18}/> Location</h4>
              <div className="space-y-2 text-sm">
                <p className="text-white">{station.address}</p>
                <p className="text-slate-500 text-xs">Lat: {station.lat}, Lng: {station.lng}</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-blue-400 hover:underline text-xs block mt-1"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* 3. Chargers List */}
          <div>
            <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Zap size={18}/> Chargers Installed</h4>
            {(!station.chargers || station.chargers.length === 0) ? (
               <p className="text-slate-500 text-sm">No chargers listed.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {station.chargers.map((charger: any, idx: number) => (
                  <div key={idx} className="bg-slate-800 border border-slate-700 p-3 rounded-lg text-sm flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{charger.type || "Standard"}</p>
                      <p className="text-slate-500 text-xs">{charger.powerKw} kW</p>
                    </div>
                    <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                      ${charger.costPerKwh}/kWh
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-900 rounded-b-2xl sticky bottom-0">
          <p className="text-slate-400 text-sm mb-4 text-center">
            Reviewing this station will help decide whether to approve the deletion request.
          </p>
          <div className="flex gap-4">
             <button 
                onClick={onReject} 
                className="flex-1 py-3 rounded-xl border border-slate-700 text-white hover:bg-slate-800 font-medium transition-colors"
             >
                Reject Request (Keep Active)
             </button>
             <button 
                onClick={onConfirm} 
                className="flex-1 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium shadow-lg shadow-red-900/20 transition-colors"
             >
                Confirm Deletion
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. MAIN DASHBOARD
// ----------------------------------------------------------------------
export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // --- DATA STATES ---
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [deleteRequests, setDeleteRequests] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]); 

  // --- MODAL STATES ---
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [newOwner, setNewOwner] = useState({ name: "", email: "", password: "", mobile: "" });
  
  // New: Review Modal State
  const [reviewStation, setReviewStation] = useState<any>(null);

  useEffect(() => { loadTabData(); }, [activeTab]);

  const loadTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        const data = await fetchAdminStats();
        setStats(data || {});
      } 
      else if (activeTab === "users") {
        const data = await fetchAllUsers();
        setUsers(data || []);
      } 
      else if (activeTab === "stations") {
        const allStations = await fetchAllStations();
        const pendingDeletes = await fetchDeleteRequests();
        setStations(allStations || []);
        setDeleteRequests(pendingDeletes || []);
      }
      else if (activeTab === "messages") {
        const data = await fetchMessages();
        setMessages(data || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleRegisterOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerOwner(newOwner);
      alert("Owner registered successfully!");
      setShowOwnerModal(false);
      setNewOwner({ name: "", email: "", password: "", mobile: "" });
      loadTabData();
    } catch (error) {
      alert("Failed to register owner. Email might exist.");
    }
  };

  const handleConfirmDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this station? This cannot be undone.")) return;
    await confirmStationDelete(id);
    setReviewStation(null); // Close modal if open
    loadTabData();
  };

  const handleRejectDelete = async (id: string) => {
    await rejectStationDelete(id);
    setReviewStation(null); // Close modal if open
    loadTabData();
  };

  const handleDeleteMessage = async (id: string) => {
    if(!window.confirm("Delete this message?")) return;
    await deleteMessage(id);
    loadTabData();
  }

  const handleLogout = () => {
    if (window.confirm("Logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className={`min-h-screen ${styles.pageBg} text-white flex font-sans`}>
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-[#0E1424] border-r border-slate-800 transition-all duration-300 flex flex-col fixed h-full z-20`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold text-indigo-400 flex items-center gap-2"><Activity/> ADMIN</h1>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Toggle Sidebar" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"><Menu size={20} aria-label="Toggle Sidebar" /></button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={Activity} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} isOpen={isSidebarOpen} />
          <SidebarItem icon={Users} label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} isOpen={isSidebarOpen} />
          <SidebarItem icon={Zap} label="Stations" active={activeTab === "stations"} onClick={() => setActiveTab("stations")} isOpen={isSidebarOpen} />
          <SidebarItem icon={MessageSquare} label="Messages" active={activeTab === "messages"} onClick={() => setActiveTab("messages")} isOpen={isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} title="Logout" className="w-full flex items-center justify-center p-2 text-red-400 hover:bg-slate-800 rounded-lg" aria-label="Logout">
             {isSidebarOpen ? "Logout" : <X size={20} />}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white capitalize">{activeTab}</h2>
        </header>

        {/* 1. OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Users} label="Total Users" value={stats.totalUsers || 0} color="text-blue-400" bg="bg-blue-500/10" />
            <StatCard icon={Zap} label="Total Stations" value={stats.totalStations || 0} color="text-yellow-400" bg="bg-yellow-500/10" />
            <StatCard icon={DollarSign} label="Revenue" value={`LKR ${stats.totalRevenue || 0}`} color="text-emerald-400" bg="bg-emerald-500/10" />
            <StatCard icon={AlertTriangle} label="Pending Requests" value={stats.pendingApprovals || 0} color="text-red-400" bg="bg-red-500/10" />
          </div>
        )}

        {/* 2. USERS */}
        {activeTab === "users" && (
          <div className={`${styles.cardBg} border border-slate-800 rounded-xl p-6`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">User Management</h3>
              <button onClick={() => setShowOwnerModal(true)} className={styles.buttonPrimary}><div className="flex items-center gap-2"><Plus size={18}/> Add Owner</div></button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-sm uppercase"><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Contact</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-800/50">
                    <td className="p-4 font-medium">{u.name}<br/><span className="text-sm text-slate-500">{u.email}</span></td>
                    <td className="p-4"><span className="bg-slate-800 px-2 py-1 rounded text-xs">{u.role}</span></td>
                    <td className="p-4 text-slate-400">{u.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. STATIONS */}
        {activeTab === "stations" && (
          <div className="space-y-8">
            
            {/* PENDING DELETE REQUESTS */}
            {deleteRequests.length > 0 && (
              <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 text-red-400"><AlertTriangle /><h3 className="text-xl font-bold">Delete Requests ({deleteRequests.length})</h3></div>
                <div className="grid gap-4">
                  {deleteRequests.map((req) => (
                    <div key={req.id} className="bg-slate-900 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center border border-slate-800 gap-4">
                      <div>
                        <h4 className="font-bold text-white text-lg">{req.name}</h4>
                        <p className="text-sm text-slate-400 flex items-center gap-1"><MapPin size={14}/> {req.address}</p>
                        <p className="text-xs text-red-400 mt-1 font-mono">Owner ID: {req.operatorId}</p>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button onClick={() => setReviewStation(req)} title="Review Station" className={styles.buttonReview + " flex-1 flex items-center justify-center gap-1"}>
                          <Eye size={18}/> Review
                        </button>
                        <button onClick={() => handleConfirmDelete(req.id)} title="Confirm Delete" className={styles.buttonDanger + " flex-1 flex items-center justify-center gap-1"}>
                          <CheckCircle size={18}/> Confirm
                        </button>
                        <button onClick={() => handleRejectDelete(req.id)} title="Reject Request" className={styles.buttonSuccess + " flex-1 flex items-center justify-center gap-1"}>
                          <XCircle size={18}/> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIVE STATIONS LIST */}
            <div className={`${styles.cardBg} border border-slate-800 rounded-xl p-6`}>
              <h3 className="text-xl font-bold mb-6">All Active Stations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stations.map((s) => (
                  <div key={s.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="flex justify-between mb-2"><Zap className="text-indigo-400"/><span className={s.isOpen?"text-emerald-400":"text-red-400"}>{s.isOpen?"Open":"Closed"}</span></div>
                    <h4 className="font-bold text-white truncate">{s.name}</h4>
                    <p className="text-slate-400 text-sm truncate"><MapPin size={14} className="inline mr-1"/>{s.address}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. MESSAGES */}
        {activeTab === "messages" && (
          <div className={`${styles.cardBg} border border-slate-800 rounded-xl p-6`}>
            <h3 className="text-xl font-bold mb-6">User Inquiries</h3>
            {messages.length === 0 ? <p className="text-slate-500">No messages found.</p> : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl hover:border-indigo-500/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-white">{msg.name}</h4>
                        <p className="text-sm text-indigo-400">{msg.email}</p>
                      </div>
                      <button onClick={() => handleDeleteMessage(msg.id)} title="Delete Message" className="text-slate-500 hover:text-red-400"><Trash2 size={18} /></button>
                    </div>
                    <p className="text-slate-300 bg-slate-900/50 p-3 rounded-lg text-sm">{msg.message}</p>
                    <div className="mt-2 text-right text-xs text-slate-500 flex justify-end items-center gap-1">
                      <Calendar size={12}/> {new Date(msg.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ADD OWNER MODAL */}
      {showOwnerModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`${styles.cardBg} border border-slate-700 rounded-2xl w-full max-w-md p-8 relative`}>
             <button onClick={()=>setShowOwnerModal(false)} title="Close Modal" className="absolute top-4 right-4 text-slate-400 hover:text-white" aria-label="Close Modal"><X size={24} /></button>
            <div className="flex justify-between mb-6"><h3 className="text-xl font-bold">New Owner</h3></div>
            <form onSubmit={handleRegisterOwner} className="space-y-4">
              <input type="text" placeholder="Name" required className={styles.input} value={newOwner.name} onChange={e=>setNewOwner({...newOwner, name:e.target.value})}/>
              <input type="email" placeholder="Email" required className={styles.input} value={newOwner.email} onChange={e=>setNewOwner({...newOwner, email:e.target.value})}/>
              <input type="text" placeholder="Mobile" required className={styles.input} value={newOwner.mobile} onChange={e=>setNewOwner({...newOwner, mobile:e.target.value})}/>
              <input type="password" placeholder="Password" required className={styles.input} value={newOwner.password} onChange={e=>setNewOwner({...newOwner, password:e.target.value})}/>
              <button type="submit" className={`w-full ${styles.buttonPrimary} mt-4`}>Create Account</button>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      <StationReviewModal 
        station={reviewStation} 
        onClose={() => setReviewStation(null)} 
        onConfirm={() => handleConfirmDelete(reviewStation.id)}
        onReject={() => handleRejectDelete(reviewStation.id)}
      />

    </div>
  );
}

// Helper Components
const StatCard = ({ icon: Icon, label, value, color, bg }: any) => (
  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-center">
    <div className={`p-4 rounded-lg ${bg} ${color} mr-4`}><Icon size={24} /></div>
    <div><p className="text-slate-400 text-sm font-medium uppercase">{label}</p><p className="text-2xl font-bold text-white">{value}</p></div>
  </div>
);

function SidebarItem({ icon: Icon, label, active, onClick, isOpen }: any) {
  return (
    <button onClick={onClick} title={label} className={`w-full flex items-center p-3 rounded-xl transition-all ${active ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" : "text-slate-400 hover:bg-slate-800"}`} aria-label={label}>
      <Icon size={20} className={isOpen ? "mr-3" : "mx-auto"} /> {isOpen && <span className="font-medium">{label}</span>}
    </button>
  );
}