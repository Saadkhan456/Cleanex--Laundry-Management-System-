import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/userLogin";
import Register from "./components/userRegister";
import AdminLogin from "./components/AdminLogin";
import AdminDashboardBoth from "./components/AdminDashboardBoth";
import DashboardMaharashtra from "./components/DashboardMaharashtra";
import DashboardKarnataka from "./components/DashboardKarnataka";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Route for the Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Route for the Registration Page */}
        <Route path="/register" element={<Register />} />

        {/* Route for Admin Login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/admin-dashboard-both" element={<AdminDashboardBoth />} />

        {/* Routes for User Dashboards */}
        <Route
          path="/DashboardMaharashtra"
          element={<DashboardMaharashtra />}
        />
        <Route path="/DashboardKarnataka" element={<DashboardKarnataka />} />
      </Routes>
    </Router>
  );
};

export default App;
