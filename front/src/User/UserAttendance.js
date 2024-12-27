import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const UserAttendence = () => {
  const [attendanceRecord, setAttendanceRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const employeeID = localStorage.getItem("employeeID");
  const employeeName = localStorage.getItem("employeeName");
  const token = localStorage.getItem("token");

  // Memoize the fetchAttendanceRecord function
  const fetchAttendanceRecord = useCallback(async () => {
    const date = new Date().toISOString().split("T")[0];

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/auth/attendance?employeeID=${employeeID}&date=${date}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAttendanceRecord(response.data || null);
    } catch (err) {
      setError("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  }, [employeeID, token]);

  useEffect(() => {
    if (employeeID && token) {
      fetchAttendanceRecord();
    } else {
      setError("Employee details are not available. Please log in.");
    }
  }, [fetchAttendanceRecord, employeeID, token]);

  const handleCheckIn = async () => {
    const date = new Date().toISOString().split("T")[0];
    const timeIn = new Date().toLocaleTimeString();

    const payload = {
      employeeID: employeeID,
      name: employeeName,
      date,
      timeIn,
      attendance: "Present",
      status: "On Time",
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/api/auth/attendance",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAttendanceRecord(response.data.record || null);
      alert(response.data.message || "Check-In successful!");
      fetchAttendanceRecord();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check in.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!attendanceRecord || !attendanceRecord._id) {
      setError("Attendance record not found. Please check in first.");
      return;
    }

    const timeOut = new Date().toLocaleTimeString();

    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:4000/api/auth/attendance/${attendanceRecord._id}`,
        { timeOut },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message || "Check-Out successful!");
      setAttendanceRecord(response.data.record || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Welcome: {employeeName}</h1>
      {error && <p>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {attendanceRecord ? (
            <>
              <p>Attendance status: {attendanceRecord.status}</p>
              <p>Check-in time: {attendanceRecord.timeIn}</p>
              {attendanceRecord.timeOut ? (
                <p>Check-out time: {attendanceRecord.timeOut}</p>
              ) : (
                <button onClick={handleCheckOut}>Check-Out</button>
              )}
            </>
          ) : (
            <button onClick={handleCheckIn}>Check-In</button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAttendence;
