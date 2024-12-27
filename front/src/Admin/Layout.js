import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { MdDashboard } from "react-icons/md";
import { FaUserTie, FaClipboardList } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import DashboardSection from "./DashboardSection";
import { useNavigate } from 'react-router-dom'
import AttendanceManagement from "./Attendance";
import EmployeeManagement from "./Employee";

const Dashboard = () => <><DashboardSection /></>;
const Employee = () => <><EmployeeManagement /></>;
const Attendance = () => <><AttendanceManagement/></>;

export default function Layout() {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const navigate = useNavigate()

  const renderComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <DashboardSection />;
      case "Employee":
        return <Employee />;
      case "Attendance":
        return <Attendance />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout=()=>{
    navigate('/')
  }

  return (
    <div className="d-flex">
      <div className="sidebar p-3 bg-dark text-white d-flex flex-column" style={{ width: "290px", minHeight: "100vh" }}>
        <div className="text-center mb-5 text-white mt-4">
          <img src="https://www.svgrepo.com/show/384676/account-avatar-profile-user-6.svg" className="mb-4" alt="profile-image" style={{ width: "120px", height: "120px" }}/>
          <h4>Admin</h4>
        </div>

        <Nav className="flex-column align-content-center flex-grow-1">

          <Nav.Link onClick={() => setActiveComponent("Dashboard")} className={`d-flex align-items-center gap-3 mb-3 ${activeComponent === "Dashboard" ? "active text-warning" : "text-white"}`} style={{ whiteSpace: "nowrap" }}>
            <MdDashboard size={27} /> Dashboard
          </Nav.Link>

          <Nav.Link onClick={() => setActiveComponent("Employee")} className={`d-flex align-items-center gap-3 mb-3 ${activeComponent === "Employee" ? "active text-warning" : "text-white"}`} style={{ whiteSpace: "nowrap" }}>
            <FaUserTie size={27} /> Employee
          </Nav.Link>

          <Nav.Link onClick={() => setActiveComponent("Attendance")} className={`d-flex align-items-center gap-3 mb-3 ${activeComponent === "Attendance" ? "active text-warning" : "text-white"}`} style={{ whiteSpace: "nowrap" }}>
            <FaClipboardList size={27} /> Attendance
          </Nav.Link>

        </Nav>
        <hr style={{border:'1px solid white'}}/>

        <Nav className="flex-column ">

          <Nav.Link className="d-flex align-items-center justify-content-center gap-3  text-white" style={{ whiteSpace: "nowrap" }} onClick={handleLogout}>
            <IoIosLogOut size={27} /> Logout
          </Nav.Link>

        </Nav>
      </div>

      <div className="p-4 flex-grow-1">{renderComponent()}</div>
    </div>
  );
}
