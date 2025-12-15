import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api_config";

export default function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(API_URL + "/auth/check", {
          headers: {
            Authorization: "Bearer " + token,
          },
          credentials: "include",
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    verifySession();
  }, [navigate]);

  return { user };
}
