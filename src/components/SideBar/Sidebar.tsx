import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutButton from "../logout/LogoutButton";



const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  

  // Helper function to check if the current path is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className=" fixed w-64 bg-[#0E1424] p-6 flex flex-col justify-between min-h-screen">
      {/* Top Section */}
      <div>
        <h1
          className="text-green-400 font-bold text-2xl mb-10 cursor-pointer"
          onClick={() => navigate("/")}
        >
          ⚡ EV HUB
        </h1>

        <ul className="space-y-5">
        <li
            onClick={() => navigate("/dashboard")}
            className={`cursor-pointer px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive("/dashboard")
                  ? "bg-green-400 text-black font-semibold"
                  : "text-white hover:bg-white/10 hover:text-green-400"
              }
            `}
          >
            Dashboard
        </li>

         <li
            onClick={() => navigate("/stations")}
            className={`cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 
              ${
                isActive("/stations")
                  ? "bg-green-400 text-black font-semibold"
                  : "text-white hover:bg-white/10 hover:text-green-400"
              }
            `}
          >
            Stations
          </li>

          <li
            onClick={() => navigate("/trips")}
            className={`cursor-pointer px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive("/trips")
                  ? "bg-green-400 text-black font-semibold"
                  : "text-white hover:bg-white/10 hover:text-green-400"
              }
            `}
          >
            My Trips
          </li>

          <li
            onClick={() => navigate("/account")}
            className={`cursor-pointer px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive("/account")
                  ? "bg-green-400 text-black font-semibold"
                  : "text-white hover:bg-white/10 hover:text-green-400"
              }
            `}
          >
            Account
          </li>

          <li
            onClick={() => navigate("/subscription")}
            className={`cursor-pointer px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive("/subscription")
                  ? "bg-green-400 text-black font-semibold"
                  : "text-white hover:bg-white/10 hover:text-green-400"
              }
            `}
          >
            Subscription
          </li>

          <li className="px-4 py-3 rounded-lg hover:bg-white/10">
            <LogoutButton />
          </li>

      </ul>
          
      </div>

      {/* Bottom Section */}
      {/* <div>
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
      </div> */}
    </aside>
  );
};

export default Sidebar;
