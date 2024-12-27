import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = ({ userId }) => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    dob: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, );

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:4000/api/auth/users/${userId}`);
      setUserData({
        ...response.data,
        dob: response.data.dob?.slice(0, 10),
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Unable to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`http://localhost:4000/api/auth/users/${userId}`, userData);
      setSuccessMessage(response.data.message || "Profile updated successfully!");
      setEditMode(false);
      fetchUserProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Unable to update profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-profile">
      <h2 className="employee-Profile">USER DETAILS</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="profile-details">
        <div className="profile-field">
          <label>Name:</label>
          {editMode ? (
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
            />
          ) : (
            <span>{userData.name || "Not provided"}</span>
          )}
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <span>{userData.email || "Not provided"}</span>
        </div>
        <div className="profile-field">
          <label>Phone:</label>
          {editMode ? (
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleInputChange}
            />
          ) : (
            <span>{userData.phone || "Not provided"}</span>
          )}
        </div>
        <div className="profile-field">
          <label>Department:</label>
          {editMode ? (
            <input
              type="text"
              name="department"
              value={userData.department}
              onChange={handleInputChange}
            />
          ) : (
            <span>{userData.department || "Not provided"}</span>
          )}
        </div>
        <div className="profile-field">
          <label>Date of Birth:</label>
          {editMode ? (
            <input
              type="date"
              name="dob"
              value={userData.dob}
              onChange={handleInputChange}
            />
          ) : (
            <span>{userData.dob || "Not provided"}</span>
          )}
        </div>
        <div className="profile-actions">
          {editMode ? (
            <>
              <button onClick={handleSaveProfile} className="btn btn-save">
                Save
              </button>
              <button onClick={() => setEditMode(false)} className="btn btn-cancel">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="btn btn-edit">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
