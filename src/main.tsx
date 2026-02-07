import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";

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
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Need to save this in Login.tsx!

  // 1. Not Logged In -> Go to Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in, but wrong role?
  if (role && !allowedRoles.includes(role)) {
    // If an OWNER tries to go to User pages -> Send back to Owner Dashboard
    if (role === "OWNER") {
      return <Navigate to="/owner-dashboard" replace />;
    }
    // If a USER tries to go to Owner pages -> Send back to User Dashboard
    if (role === "USER") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // 3. Authorized -> Show Page
  return element;
};

// Router
const router = createBrowserRouter([

   {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/about", element: <AboutUs /> },
      { path: "/contact", element: <ContactUs /> },
    ],
  },

   // Public routes without Navbar/Footer
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <Login /> },
  { path: "/oauth2/redirect", element: <OAuthRedirect /> },
  {path:"/under-development", element:<UnderDeveloping/>},

  { 
    path: "/owner-dashboard", 
    element: (
      <RoleProtectedRoute 
        element={<OwnerDashboard />} 
        allowedRoles={["OWNER"]} 
      />
    )
  },
  { 
    path: "/owner/station/:id", 
    element: (
      <RoleProtectedRoute 
        // Import OwnerStationDetails at the top of the file!
        element={<OwnerStationDetails />} 
        allowedRoles={["OWNER"]} 
      />
    )
  },
  
  // Public
  // { path: "/", element: <App /> },
  // { path: "/signup", element: <SignUp /> },
  // { path: "/login", element: <Login /> },
  // { path: "/about", element: <AboutUs /> },
  // { path: "/contact", element: <ContactUs /> },

  // Private routes wrapped in Layout
  {
    path: "/",
    element: (
      <RoleProtectedRoute 
        element={<Layout />} 
        allowedRoles={["USER"]} 
      />
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "stations", element: <Stations /> },
      { path: "account", element: <Account /> },
      { path: "/stations/:id", element: <StationDetails /> },
      { path:"/booking/:stationId/:chargerId", element: <BookingPage/>}
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
