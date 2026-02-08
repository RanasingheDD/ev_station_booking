import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api_config";
import { useUser } from "../../context/UserContext";

export default function useAuth() {
  const navigate = useNavigate();
  const { setUser, setLoading } = useUser();

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        // Fetch user with points data from /users/me endpoint
        const res = await axios.get(API_URL + "/users/me", {
          headers: { Authorization: "Bearer " + token },
          withCredentials: true,
        });

        const userData = res.data;
        // Store user data in context
        setUser({
          id: userData.id || "",
          name: userData.name || "",
          email: userData.email || "",
          mobile: userData.mobile,
          avatar: userData.avatar,
          location: userData.location,
          points: userData.points || 0,
          role: userData.role,
        });
      } catch (error) {
        console.error("Auth verification error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        setUser(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [navigate, setUser, setLoading]);


}
