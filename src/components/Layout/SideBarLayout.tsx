// components/layout/Layout.tsx
import React from "react";
import Sidebar from "../SideBar/Sidebar.tsx";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-[#0A0F1C]">
        <Outlet /> {/* Renders Dashboard, Stations, etc. */}
      </main>
    </div>
  );
};

export default Layout;
