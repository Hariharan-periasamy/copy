import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginRegister from "./Login/LoginSignup";
import Layout from "./Admin/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import UserLayout from "./User/UserLayout";
import "./Admin/Admin.css";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginRegister />} />
      <Route path="/admin-dashboard" element={<Layout />} />
      <Route
        path="/user-dashboard"
        element={
          <UserLayout
            userId={localStorage.getItem("userId")}
            userName={localStorage.getItem("userName")}
          />
        }
      />{" "}
    </Routes>
  </Router>
);

export default App;
