import {
  BuildOutlined,
  Dashboard,
  Home,
  PeopleAltOutlined,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import PaymentIcon from "@mui/icons-material/Payment";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import icons from '../sidebarIcons/index'
const Sidemenu = ({ user }) => {

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUserRole = localStorage.getItem("user");

    if (storedUserRole) {
      const user = JSON.parse(storedUserRole);
      // console.log("local", user.role)
      setUserRole(user.role);

    } else {
      // console.log("No user role found in localStorage");
    }
  }, []);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  // Sidebar menu configuration based on role
  const sidebarConfig = {
    //default routes
    default: [
      { name: "Dashboard",  icon: icons.Dashboard, path: "/dashboard" },
      { name: "Company", icon:icons.building, path: "/company" },
      { name: "Manual Tasks", icon: <TaskOutlinedIcon />, path: "/tasks" },
      { name: "Auto Tasks", icon: icons.vector, path: "/tasks/auto" },

      { name: "Users", icon: icons.frame, path: "/users" },
      {
        name: "Notification Settings",
        icon: icons.bell,
        path: "/notification-settings",
      },
    ],

    //super admin routes
    S: [
      { name: "Agency", icon: <AssuredWorkloadIcon />, path: "/agency" },
      {
        name: "Service Calendar",
        icon: <CalendarMonthIcon />,
        path: "/service-calendar",
      },
    ],
    //admin routesa
    A: [
      { name: "Dashboard", icon: icons.Dashboard, path: "/dashboard" },
      { name: "Company",icon:icons.building, path: "/company" },
      { name: "Manual Tasks", icon: <TaskOutlinedIcon />, path: "/tasks" },
      { name: "Auto Tasks",  icon: icons.vector, path: "/tasks/auto" },

      {
        name: "Completed Tasks",
        icon: <AssignmentTurnedInOutlinedIcon />,
        path: "/tasks/done",
      },
      {
        name: "Payments",
        icon: <PaymentIcon />,
        path: "/payments",
      },
      { name: "Users", icon: icons.frame, path: "/users" },
      {
        name: "Notification Settings",
        icon: icons.bell,
        path: "/notification-settings",
      },
    ],
  };

  const getUserSidebarItems = () => {
    // Default to all items if no specific role
    let items = sidebarConfig[user?.role] || sidebarConfig.default;
    if (user?.role === "U") {
      items = items.filter((item) => (item.name !== "Users" && item.name !== "Notification Settings"));
    }

    return items;
  };

  useEffect(() => {
    setActiveItem(location.pathname || "/dashboard");
  }, [location]);

  const handleMenuClick = (item) => {
    setActiveItem(item);
  };

  const sidebarItems = getUserSidebarItems();

  return (
    <div
      className={`fixed inset-y-0 left-0 mt-[80px] transition-all duration-300 shadow-xl bg-white border-r border-t border-gray-200 `}
      style={{ width: "200px",zIndex:"900", }}
    >
      <div className="mt-12">
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.name} className='mb-4'>
       <Link
            to={item.path}
            onClick={() => handleMenuClick(item.path)}
            className={`relative flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors duration-200
            ${activeItem === item.path ? "text-[#00008B] font-semibold" : "text-[#A3AED0]"}
            `}
          >
               {typeof item.icon === "string" ? (
                <div >
              <img src={item.icon} alt={item.name} width={24} height={24}
              style={{
              filter:
                activeItem === item.path
                 ? "brightness(0) saturate(100%) invert(10%) sepia(94%) saturate(2000%) hue-rotate(220deg) brightness(100%) contrast(100%)"
                 : "brightness(0) saturate(100%) invert(80%) sepia(15%) saturate(300%) hue-rotate(190deg) brightness(90%) contrast(90%)",
                 }}

              />
              </div>
             ) : (
             // Render Material UI Icons (React Components)
              <span>{item.icon}</span>
             )}

           {isOpen && (
           <span
                className={`text-[15.5px] leading-[20.7px] ${
                activeItem === item.path ? "text-[#00008B]" : "text-[#A3AED0]"
                }`}
                >
                {item.name}
            </span>
              )}

              {/* Blue Right-Side Line When Active */}
              {activeItem === item.path && (
               <span className="absolute right-0 top-0 h-full w-[4px] bg-[#4318FF] rounded-md"></span>
             )}
        </Link>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidemenu;
