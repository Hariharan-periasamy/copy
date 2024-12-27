import React, { useState } from "react";
import axios from "axios";

const AddEmployeeForm = ({ onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    password: "123456", // Default password for new employees
  });

  const [error, setError] = useState(null);
  const departments = ["frontend", "backend", "UI/UX", "Digital Marketing"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post("http://localhost:4000/api/auth/register", formData);
      alert(response.data.message);
  
      // Store employee details in localStorage
      localStorage.setItem("employeeID", response.data.employeeID);  // Assuming employeeID is returned
      localStorage.setItem("employeeName", formData.name);
  
      onEmployeeAdded(); // Trigger refresh in parent component
      setFormData({ name: "", email: "", phone: "", department: "", password: "123456" });
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };
  

  return (
    <div className="add-employee-form">
      <h3>Add New Employee</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
            className="form-select"
          >
            <option value="" disabled>
              Select Department
            </option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Add Employee
        </button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default AddEmployeeForm;
