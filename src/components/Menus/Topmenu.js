import React, { useState } from "react";
import logo from "../../assests/svg/logo.svg";
import { NotificationsSharp, Person2 } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Profile from "./Profile";
import { Button } from "@mui/material";

const Topmenu = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");
  };

  return (
    <>
      <div className="w-full">
        <div
          className="flex items-center justify-between p-3 border-b border-gray-200"
          style={{ height: "80px" }}
        >
          <h2></h2>
          <div className="flex items-center space-x-4">
            <div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md">
                <NotificationsSharp className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </div>
            </div>
            <div>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md"
              >
                <Person2 />
              </button>
              {isProfileDropdownOpen && (
                <div className="mt-2 w-48 bg-white rounded-md shadow-lg py-2 absolute right-0">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topmenu;
