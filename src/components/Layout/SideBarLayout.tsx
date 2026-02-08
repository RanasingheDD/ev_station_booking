// components/layout/Layout.tsx
import React, { useState } from "react";
import Sidebar from "../SideBar/Sidebar.tsx";
import { Outlet } from "react-router-dom";
import type { Station } from "../../models/station_model.ts";
import ChatbotToggle from "../chatbot/ChatbotToggle.tsx";

const Layout: React.FC = () => {
  const [evStations, setEvStations] = useState<(Station & { distance: number })[]>([]);
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Chatbot always floats on left-hand side */}
      <ChatbotToggle stations={evStations} />
      
      <main className="flex-1 p-6 bg-[#0A0F1C]">
        <Outlet context={{setEvStations}}/> {/* Renders Dashboard, Stations, etc. */}
      </main>
      
      

    </div>
    
  );
};

export default Layout;
