import React, { useState, useEffect } from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import useAuth from "../hooks/useAuth"; // Assuming you have this hook
// You will need to create this service function later
// import { getOwnerStations, deleteStation } from "../../services/station_service"; 
import { Plus, Edit, Trash2, MapPin, Zap } from "lucide-react";

export default function OwnerDashboard() {
  const { user } = useAuth(); // Get logged in user details
  const [stations, setStations] = useState<any[]>([]); // Store owner's stations

  // Mock Data for visualization (We will replace this with API call later)
  useEffect(() => {
    setStations([
      {
        id: 1,
        name: "GreenEnergy Hub - Colombo",
        location: "Colombo 07",
        status: "Available",
        price: "$0.50/kWh",
        earnings: "$120.00",
        image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000",
      },
      {
        id: 2,
        name: "Kandy Fast Charge",
        location: "Kandy City Center",
        status: "Maintenance",
        price: "$0.45/kWh",
        earnings: "$45.00",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000",
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Owner Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.name || "Partner"}!</p>
          </div>
          <button className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors shadow-lg">
            <Plus size={20} />
            Add New Station
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-2">Total Stations</p>
            <h3 className="text-3xl font-bold text-gray-800">{stations.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-2">Total Earnings</p>
            <h3 className="text-3xl font-bold text-green-600">$165.00</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-2">Active Bookings</p>
            <h3 className="text-3xl font-bold text-blue-600">8</h3>
          </div>
        </div>

        {/* My Stations List */}
        <h2 className="text-xl font-bold text-gray-800 mb-6">My Charging Stations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <div key={station.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
              <div className="relative h-48">
                <img 
                  src={station.image} 
                  alt={station.name} 
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                  station.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {station.status}
                </span>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{station.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin size={16} className="mr-1" />
                  {station.location}
                </div>
                
                <div className="flex justify-between items-center py-3 border-t border-gray-100 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Price</p>
                    <p className="font-semibold text-gray-700">{station.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Earnings</p>
                    <p className="font-semibold text-green-600">{station.earnings}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors" type="button">
                    <Edit size={16} /> Edit
                  </button>
                  <button className="flex items-center justify-center p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete station" type="button">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}