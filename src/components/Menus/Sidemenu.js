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
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';

const Sidemenu = ({ user }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  // Sidebar menu configuration based on role
  const sidebarConfig = {
    default: [
      { name: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
      { name: "Company", icon: <BusinessIcon />, path: "/company" },
      { name: "Tasks", icon: <TaskOutlinedIcon />, path: "/tasks" },
      { name: "Users", icon: <PeopleAltOutlined />, path: "/users" },
      { name: "Notification Settings", icon: <NotificationsActiveOutlinedIcon />, path: "/notification-settings" },
      { name: "Agency", icon: <AssuredWorkloadIcon />, path: "/agency" },
    ],
    S: [
      { name: "Agency", icon: <AssuredWorkloadIcon />, path: "/agency" },
    ],
    A: [
      { name: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
      { name: "Company", icon: <BusinessIcon />, path: "/company" },
      { name: "Tasks", icon: <TaskOutlinedIcon />, path: "/tasks" },
      { name: "Users", icon: <PeopleAltOutlined />, path: "/users" },
      { name: "Notification Settings", icon: <NotificationsActiveOutlinedIcon />, path: "/notification-settings" },
    ],
  };

  const getUserSidebarItems = () => {
    // Default to all items if no specific role
    return sidebarConfig[user?.role] || sidebarConfig.default;
  };

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setActiveItem(path || "dashboard");
  }, [location]);

  const handleMenuClick = (item) => {
    setActiveItem(item);
  };

  const sidebarItems = getUserSidebarItems();

  return (
    <div
      className={`fixed inset-y-0 left-0 transition-all duration-300 bg-white border-r border-gray-200 z-30`}
      style={{ width: "200px" }}
    >
      <div className="mt-16">
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={() => handleMenuClick(item.path.substring(1))}
                className={`flex items-center gap-2 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 ${activeItem === item.path.substring(1)
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-transparent"
                  } border-l-4 transition-colors duration-200`}
              >
                {item.icon}
                {isOpen && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidemenu;
