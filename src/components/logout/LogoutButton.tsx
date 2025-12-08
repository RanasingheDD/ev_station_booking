import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();
  

  const handleLogout = async () => {


    // Clear token
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // Redirect to login
    navigate("/login");
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
