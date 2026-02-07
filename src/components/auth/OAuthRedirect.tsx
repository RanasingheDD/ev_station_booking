import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthRedirect(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      console.error("No token found in URL");
      navigate("/login", { replace: true });
      return;
    }

    try {
      // Decode JWT to extract role and other info
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const decoded = JSON.parse(atob(parts[1]));
      const role = decoded.role || "USER";
      const email = decoded.sub || decoded.email || "";
      const name = decoded.name || decoded.given_name || email.split("@")[0] || "User";

      // Store token, role, name, and email
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("role", role);

      // Redirect based on role
      setTimeout(() => {
        if (role === "OWNER") {
          navigate("/owner-dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }, 500);
    } catch (error) {
      console.error("Error processing OAuth token:", error);
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#0B0F19",
    }}>
      <p style={{ color: "#fff", fontSize: "18px" }}>Processing login...</p>
    </div>
  );
}
