// App.js
import React, { useState } from "react";
import "./App.css";
import Login from "./pages/Auth/Login";
import { Route, Routes } from "react-router";
import Pagenotfound from "./pages/Auth/Pagenotfound";
import Company from "./pages/company/Company";
import Tasks from "./pages/Tasks/Tasks";
import Users from "./pages/users/Users";
import Dashboard from "./pages/Dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationSettings from "./pages/notifications/NotificationSettings";
import Agency from "./pages/Agency/Agency";

function App() {
  return (
    <>
      <ToastContainer className="my-6 p-4" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/users" element={<Users />} />
        <Route path="/company" element={<Company />} />
        <Route
          path="/notification-settings"
          element={<NotificationSettings />}
        />
        <Route path="/agency" element={<Agency />} />

        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
