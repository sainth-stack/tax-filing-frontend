import { BuildOutlined, Dashboard, Home } from "@mui/icons-material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import BusinessIcon from "@mui/icons-material/Business";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
const Sidemenu = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(true); // Sidebar starts open

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

          {/* Add more menu items here as needed */}
          {/* Tasks Menu */}
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
              <TaskOutlinedIcon/>
              {isOpen && <span className="text-sm font-medium">Tasks</span>}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidemenu;
