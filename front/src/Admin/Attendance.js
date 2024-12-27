import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/auth/attendance/all");
      setAttendanceRecords(response.data);
    } catch (err) {
      console.error("Error fetching attendance records:", err.message);
      setError("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-management">
      <h2 className="Admin-heaaders text-center">Attendance Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Emp.ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Attendance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record) => (
                <tr key={record._id}>
                  <td>{record.employeeID || "N/A"}</td>
                  <td>{record.name || "N/A"}</td>
                  <td>{record.date || "N/A"}</td>
                  <td>{record.timeIn || "-"}</td>
                  <td>{record.timeOut || "-"}</td>
                  <td>{record.attendance || "-"}</td>
                  <td>{record.status || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No attendance records available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAttendance;
