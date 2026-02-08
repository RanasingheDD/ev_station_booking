import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import {getUserRole, isTokenValid} from "./components/utils/authUtils";
// Public pages
import App from "./App";
import AboutUs from "./components/home/about";
// import Partners from './pages/Partners'
// import ContactUs from './pages/ContactUs'
import SignUp from "./components/Registration/Registration";
import Login from "./components/login/login";

// Private pages
import Dashboard from "./components/pages/EVHubDashboard";
import Stations from "./components/pages/EVHubStations";
import Layout from "./components/Layout/SideBarLayout";
import Account from "./components/pages/EVHubAccount";
import StationDetails from "./components/pages/EVHubStationDetails";
import ContactUs from "./components/contactUs/contactUs";
import PublicLayout from "./components/Layout/PublicLayout";
import OwnerDashboard from "./components/pages/OwnerDashboard";
import BookingPage from "./components/pages/BookingPage";
import UnderDeveloping from "./components/underDeveloping/underDeveloping";
import OwnerStationDetails from "./components/pages/OwnerStationDetails";
import OAuthRedirect from "./components/auth/OAuthRedirect";

const RoleProtectedRoute = ({ 
  element, 
  allowedRoles 
}: { 
  element: React.ReactElement, 
  allowedRoles: string[] 
}) => {
  if (!isTokenValid()) {
    localStorage.removeItem("token"); // Cleanup invalid token
    return <Navigate to="/login" replace />;
  }
  const role = getUserRole();
  // 2. Logged in, but wrong role?
  if (!role || !allowedRoles.includes(role)) {
    // Smart Redirects: Send them to their actual home if they are lost
    if (role === "OWNER") {
      return <Navigate to="/owner" replace />;
    }
    if (role === "USER") { 
       return <Navigate to="/app/dashboard" replace />;
    }
    
    // Default Deny: If role is missing or unknown, kick to login
    return <Navigate to="/login" replace />;
  }

  // 3. Authorized -> Show Page
  return element;
};

// Router
const router = createBrowserRouter([
  // Public pages wrapped with PublicLayout
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <App /> },
      { path: "about", element: <AboutUs /> },
      { path: "contact", element: <ContactUs /> },
      { path: "under-development", element: <UnderDeveloping /> },
    ],
  },

  // Auth pages (kept outside PublicLayout for a focused UI)
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <Login /> },
  { path: "/oauth2/redirect", element: <OAuthRedirect /> },

  // Owner routes grouped under /owner
  {
    path: "/owner",
    children: [
      {
        index: true,
        element: (
          <RoleProtectedRoute element={<OwnerDashboard />} allowedRoles={["OWNER"]} />
        ),
      },
      {
        path: "station/:id",
        element: (
          <RoleProtectedRoute element={<OwnerStationDetails />} allowedRoles={["OWNER"]} />
        ),
      },
    ],
  },

  // Private user routes wrapped in Sidebar Layout
  {
    path: "/app",
    element: <RoleProtectedRoute element={<Layout />} allowedRoles={["USER"]} />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "stations", element: <Stations /> },
      { path: "stations/:id", element: <StationDetails /> },
      { path: "account", element: <Account /> },
      { path: "booking/:stationId/:chargerId", element: <BookingPage /> },
    ],
  },

  // Fallback — redirect unknown routes to home
  // Backwards-compatible redirects for existing links
  { path: "/dashboard", element: <Navigate to="/app/dashboard" replace /> },
  { path: "/stations", element: <Navigate to="/app/stations" replace /> },
  { path: "/account", element: <Navigate to="/app/account" replace /> },
  { path: "/stations/:id", element: <Navigate to="/app/stations/:id" replace /> },
  { path: "/booking/:stationId/:chargerId", element: <Navigate to="/app/booking/:stationId/:chargerId" replace /> },
  { path: "/owner-dashboard", element: <Navigate to="/owner" replace /> },
  { path: "/owner/station/:id", element: <Navigate to="/owner/station/:id" replace /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
