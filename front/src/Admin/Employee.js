
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddEmployeeForm from "./AddEmployeeForm"; 

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const departments = ["All", "frontend", "backend", "UI/UX", "Digital Marketing"];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/auth/users");
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:4000/api/auth/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Ensure the token is sent for authentication
      },
    });

    const updatedEmployees = employees.filter((employee) => employee._id !== id);
    setEmployees(updatedEmployees);
    filterEmployeesByDepartment(selectedDepartment, updatedEmployees);
  } catch (error) {
    console.error("Error deleting employee:", error);
    alert(error.response?.data?.message || "An error occurred while deleting.");
  }
};


  const filterEmployeesByDepartment = (department, allEmployees = employees) => {
    if (department === "All") {
      setFilteredEmployees(allEmployees);
    } else {
      const filtered = allEmployees.filter((employee) => employee.department === department);
      setFilteredEmployees(filtered);
    }
  };

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
    filterEmployeesByDepartment(department);
  };

  const handleEmployeeAdded = () => {
    fetchEmployees(); // Refresh the employee list
  };

  return (
    <div className="employee-management">
      <h2 className=" Admin-heaaders text-center">Employee Management</h2>

      {/* Add Employee Section */}
      <AddEmployeeForm onEmployeeAdded={handleEmployeeAdded} />

      {/* Filter Section */}
      <div className="filter-container mb-3">
        <label htmlFor="departmentFilter" className=" form-label">
          Filter by Department
        </label>
        <select
          id="departmentFilter"
          className="form-select"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee, index) => (
            <tr key={employee._id}>
              <td>{index + 1}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.phone}</td>
              <td>{employee.department}</td>
              <td>
                <button
                  onClick={() => handleDelete(employee._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;

