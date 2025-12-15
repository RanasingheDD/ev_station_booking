import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

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

//PrivateRoute Component
const PrivateRoute = ({ element }: { element: React.ReactElement }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
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

  { 
    path: "/owner-dashboard", 
    element: <PrivateRoute element={<OwnerDashboard />} /> 
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
    element: <PrivateRoute element={<Layout />} />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "stations", element: <Stations /> },
      { path: "account", element: <Account /> },
      { path: "/stations/:id", element: <StationDetails /> },
      // Add more private pages here
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
