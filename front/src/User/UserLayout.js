  import React, { useState, useEffect } from "react";
  import { Nav } from "react-bootstrap";
  import { MdDashboard } from "react-icons/md";
  import { FaClipboardList } from "react-icons/fa";
  import { IoIosLogOut } from "react-icons/io";
  import { useNavigate } from 'react-router-dom';
  import UserAttendance from "./UserAttendance";
  import UserDashboard from "./UserDashboard";

  const Dashboard = () => <><UserDashboard/></>;
  const Employee = () => <></>;
  const Attendance = () => <><UserAttendance /></>;

  export default function UserLayout() {
    const [activeComponent, setActiveComponent] = useState("Dashboard");
    const [userName, setUserName] = useState(""); 
    const navigate = useNavigate();

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setUserName(user.name); 
      }
    }, []);

    const renderComponent = () => {
      switch (activeComponent) {
        case "Dashboard":
          return <Dashboard />;
        case "Employee":
          return <Employee />;
        case "Attendance":
          return <Attendance />;
        default:
          return <Dashboard />;
      }
    };

    const handleLogout = () => {
      localStorage.removeItem('user'); 
      navigate('/'); 
    }

    return (
      <div className="d-flex">
        <div className="sidebar p-3 bg-dark text-white d-flex flex-column" style={{ width: "290px", minHeight: "100vh" }}>
          <div className="text-center mb-5 mt-4">
            <img src="https://www.svgrepo.com/show/384676/account-avatar-profile-user-6.svg" className="mb-4" alt="profile-image" style={{ width: "120px", height: "120px" }} />
            <h4 className="user-name">{userName || "Name"}</h4> 
          </div>

          <Nav className="flex-column align-content-center flex-grow-1">
            <Nav.Link onClick={() => setActiveComponent("Dashboard")} className={`d-flex align-items-center gap-3 mb-3 ${activeComponent === "Dashboard" ? "active text-warning" : "text-white"}`} style={{ whiteSpace: "nowrap" }}>
              <MdDashboard size={27} /> Dashboard
            </Nav.Link>

            <Nav.Link onClick={() => setActiveComponent("Attendance")} className={`d-flex align-items-center gap-3 mb-3 ${activeComponent === "Attendance" ? "active text-warning" : "text-white"}`} style={{ whiteSpace: "nowrap" }}>
              <FaClipboardList size={27} /> Attendance
            </Nav.Link>
          </Nav>
          <hr style={{ border: '1px solid white' }} />

          <Nav className="flex-column">
            <Nav.Link className="d-flex align-items-center justify-content-center gap-3 text-white" style={{ whiteSpace: "nowrap" }} onClick={handleLogout}>
              <IoIosLogOut size={27} /> Logout
            </Nav.Link>
          </Nav>
        </div>

        <div className="p-4 flex-grow-1">{renderComponent()}</div>
      </div>
    );
  }
