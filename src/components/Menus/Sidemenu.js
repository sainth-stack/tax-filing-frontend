import {
  BuildOutlined,
  Dashboard,
  Home,
  PeopleAltOutlined,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import BusinessIcon from "@mui/icons-material/Business";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";

const Sidemenu = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [isOpen, setIsOpen] = useState(true); // Sidebar starts open

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setActiveItem(path || "company");
  }, [location]);

  const handleMenuClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 transition-all duration-300 bg-white border-r border-gray-200 z-30`}
      style={{ width: "200px" }}
    >
      {/* Sidebar Menu */}
      <div className="mt-16">
        <ul>
          {/* Dashboard Menu Item */}
          <li>
            <Link
              to="/dashboard"
              onClick={() => handleMenuClick("dashboard")}
              className={`flex items-center gap-2 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 ${
                activeItem === "dashboard"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-transparent"
              } border-l-4 transition-colors duration-200`}
            >
              <Dashboard />
              {isOpen && <span className="text-sm font-medium">Dashboard</span>}
            </Link>
          </li>

          {/* Company Menu Item */}
          <li>
            <Link
              to="/company"
              onClick={() => handleMenuClick("company")}
              className={`flex items-center gap-2 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 ${
                activeItem === "company"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-transparent"
              } border-l-4 transition-colors duration-200`}
            >
              <BusinessIcon />
              {isOpen && <span className="text-sm font-medium">Company</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/tasks"
              onClick={() => handleMenuClick("tasks")}
              className={`flex items-center gap-2 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 ${
                activeItem === "tasks"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-transparent"
              } border-l-4 transition-colors duration-200`}
            >
              <TaskOutlinedIcon />
              {isOpen && <span className="text-sm font-medium">Tasks</span>}
            </Link>
          </li>
          {/* for users */}
          <li>
            <Link
              to="/users"
              onClick={() => handleMenuClick("users")}
              className={`flex items-center gap-2 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 ${
                activeItem === "users"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-transparent"
              } border-l-4 transition-colors duration-200`}
            >
              <PeopleAltOutlined />
              {isOpen && <span className="text-sm font-medium">Users</span>}
            </Link>
          </li>
          {/* notification settings */}
          <li>
            <Link
              to="/notification-settings"
              onClick={() => handleMenuClick("notification-settings")}
              className={`flex items-center gap-2 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 ${
                activeItem === "notification-settings"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-transparent"
              } border-l-4 transition-colors duration-200`}
            >
              <NotificationsActiveOutlinedIcon />
              {isOpen && (
                <span className="text-sm font-medium">
                  Notification-Settings
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidemenu;
