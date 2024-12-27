import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoTime } from "react-icons/io5";

function DashboardSection() {
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    onTimeToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/api/auth/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
          },
        });
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch dashboard data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="text-center">Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>
            Total Employees <BsFillPeopleFill />
          </h3>
          <p>{dashboardData.totalEmployees}</p>
        </div>
        <div className="card">
          <h3>
            On Time Today <IoTime />
          </h3>
          <p>{dashboardData.onTimeToday}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardSection;
