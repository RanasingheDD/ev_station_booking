import { useLocation, useNavigate } from "react-router-dom";
import { clearStationsCache } from "../../services/station_service";
import { clearCachedLocation } from "../hooks/useLocation";

export default function LogoutButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogout = async () => {
    // Clear token
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    // Clear app caches (stations + session location)
    try {
      clearStationsCache();
      clearCachedLocation();
    } catch (err) {
      console.warn("Error clearing caches on logout", err);
    }

    // Redirect to login
    //navigate("/login");
    navigate(from, { replace: true }); 
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
    >
      Logout
    </button>
  );
}
