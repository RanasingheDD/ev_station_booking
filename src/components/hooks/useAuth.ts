import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/auth/check", {
          headers: {
            Authorization: "Bearer " + token,
          },
          credentials: "include",
        });

        if (!res.ok) {
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
}
