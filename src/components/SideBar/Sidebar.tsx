import React from "react";
import { Car } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if the current path is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-[#0E1424] p-6 flex flex-col justify-between min-h-screen">
      {/* Top Section */}
      <div>
        <h1
          className="text-green-400 font-bold text-2xl mb-10 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          ⚡ EV HUB
        </h1>

        <ul className="space-y-6">
        <li
          onClick={() => navigate("/dashboard")}
          className={`cursor-pointer hover:text-green-400 ${
            isActive("/dashboard") ? "text-green-400 font-semibold" : "text-white"
          }`}
        >
          Dashboard
        </li>
        <li
          onClick={() => navigate("/stations")}
          className={`cursor-pointer hover:text-green-400 ${
            isActive("/stations") ? "text-green-400 font-semibold" : "text-white"
          }`}
        >
          Stations
        </li>
        <li
          onClick={() => navigate("/trips")}
          className={`cursor-pointer hover:text-green-400 ${
            isActive("/trips") ? "text-green-400 font-semibold" : "text-white"
          }`}
        >
          My Trips
        </li>
        <li
          onClick={() => navigate("/account")}
          className={`cursor-pointer hover:text-green-400 ${
            isActive("/account") ? "text-green-400 font-semibold" : "text-white"
          }`}
        >
          Account
        </li>
        <li
          onClick={() => navigate("/subscription")}
          className={`cursor-pointer hover:text-green-400 ${
            isActive("/subscription") ? "text-green-400 font-semibold" : "text-white"
          }`}
        >
          Subscription
        </li>
      </ul>

      </div>

      {/* Bottom Section */}
      <div>
        <h2 className="text-gray-400 text-sm mb-4">My Cars</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-[#161B2E] p-3 rounded-lg">
            <div>
              <h3 className="text-white font-semibold">Tesla Model Y</h3>
              <p className="text-xs text-gray-400">85% | 260 miles</p>
            </div>
            <Car className="text-green-400" />
          </div>
          <div className="flex items-center justify-between bg-[#161B2E] p-3 rounded-lg">
            <div>
              <h3 className="text-white font-semibold">Nissan Leaf</h3>
              <p className="text-xs text-gray-400">76% | 210 miles</p>
            </div>
            <Car className="text-green-400" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
