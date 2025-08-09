// StatsContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { fetchDashboardStats } from "../api/AdminApi";

const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshStats = async () => {
    setLoading(true);
    try {
      const res = await fetchDashboardStats();
      if (res.success) {
        setStats(res.data);
      } else {
        console.error("Failed to fetch dashboard statistics:", res.message);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard statistics:", err.message || err);
      if (
        err.message?.toLowerCase().includes("token") ||
        err.message?.includes("401")
      ) {
        alert("Session expired. Please log in again.");
        window.location.href = "/admin/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!stats) refreshStats();
    else setLoading(false);
  }, []);

  return (
    <StatsContext.Provider value={{ stats, loading, refreshStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => useContext(StatsContext);