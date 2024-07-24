import React, { useState } from "react";
import logo from "../../assests/svg/logo.svg";
import {
  ArchiveSharp,
  MessageSharp,
  NotificationsSharp,
  SettingsSharp,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import Profile from "./Profile";

const Topmenu = () => {
  const [activeTab, setActiveTab] = useState("Notifications");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (window.innerWidth < 640) {
      // Close mobile menu on tab click
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className=" z-50 ">
        {/* Mobile View */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-between p-4">
            <img src={logo} alt="Logo" className="h-8" />
            <button
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
          {isMobileMenuOpen && (
            <div className="bg-white border-t border-gray-200">
              <ul>
                <li>
                  <a
                    onClick={() => handleTabClick("Settings")}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                      activeTab === "Settings"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    <SettingsSharp className="w-5 h-5" />
                    Settings
                  </a>
                </li>

                <li>
                  <a
                    onClick={() => handleTabClick("Messages")}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                      activeTab === "Messages"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    <MessageSharp className="h-5 w-5" />
                    Messages
                  </a>
                </li>

                <li>
                  <a
                    onClick={() => handleTabClick("Archive")}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                      activeTab === "Archive"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    <ArchiveSharp className="h-5 w-5" />
                    Archive
                  </a>
                </li>

                <li>
                  <a
                    onClick={() => handleTabClick("Notifications")}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                      activeTab === "Notifications"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    <NotificationsSharp className="w-5 h-5" />
                    Notifications
                  </a>
                </li>
              </ul>
              <div className="flex justify-center p-4">
                <Link
                  className="inline-flex items-center justify-center rounded-full p-2 text-gray-500 hover:text-gray-700"
                  aria-current="page"
                >
                  <Profile />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <div className=" border-gray-200">
            <nav
              className="flex items-center justify-between p-4"
              aria-label="Tabs"
            >
              <div className="flex space-x-6">
                <Link
                  onClick={() => handleTabClick("Settings")}
                  className={`inline-flex items-center gap-2 border-b-2 px-1 pb-4 text-sm font-medium ${
                    activeTab === "Settings"
                      ? "border-sky-500 text-sky-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <SettingsSharp className="w-5 h-5" />
                  Settings
                </Link>

                <Link
                  onClick={() => handleTabClick("Messages")}
                  className={`inline-flex items-center gap-2 border-b-2 px-1 pb-4 text-sm font-medium ${
                    activeTab === "Messages"
                      ? "border-sky-500 text-sky-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <MessageSharp className="h-5 w-5" />
                  Messages
                </Link>

                <Link
                  onClick={() => handleTabClick("Archive")}
                  className={`inline-flex items-center gap-2 border-b-2 px-1 pb-4 text-sm font-medium ${
                    activeTab === "Archive"
                      ? "border-sky-500 text-sky-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <ArchiveSharp className="h-5 w-5" />
                  Archive
                </Link>

                <Link
                  onClick={() => handleTabClick("Notifications")}
                  className={`inline-flex items-center gap-2 border-b-2 px-1 pb-4 text-sm font-medium ${
                    activeTab === "Notifications"
                      ? "border-sky-500 text-sky-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                  aria-current="page"
                >
                  <NotificationsSharp className="w-5 h-5" />
                  Notifications
                </Link>
              </div>

              {/* Profile Icon */}
              <Link
                className="inline-flex items-center justify-center rounded-full p-2 text-gray-500 hover:text-gray-700"
                aria-current="page"
              >
                <Profile />
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topmenu;
