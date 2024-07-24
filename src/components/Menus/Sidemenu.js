import React, { useState } from "react";

const Sidemenu = () => {
  const [activeItem, setActiveItem] = useState("general");
  const [isOpen, setIsOpen] = useState(false); // Start with the sidebar open by default

  const handleMenuClick = (item) => {
    setActiveItem(item);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 ${
        isOpen ? "w-57" : "w-15"
      } transition-width duration-300 bg-white border-r border-gray-200 z-30`}
    >
      {/* Toggle Button for Mobile and Desktop */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 lg:hidden"
      >
        {isOpen ? (
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
      </button>

      {/* Sidebar Menu */}
      <div className="mt-12">
        <ul>
          {/* Toggle Button Inside Sidebar */}
          <li>
            <button
              onClick={toggleSidebar}
              className={`flex items-center gap-2 px-4 py-3 text-gray-500 hover:bg-gray-50 ${
                isOpen ? "justify-between" : "justify-center"
              }`}
            >
              {/* <span className="text-sm font-medium">
                {isOpen ? "Collapse" : "Expand"}
              </span> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {isOpen ? (
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
          </li>

          {/* Menu Items */}
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick("general");
              }}
              className={`flex items-center gap-2 px-4 py-3 text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 ${
                activeItem === "general"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-transparent"
              } border-s-[3px]`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 opacity-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {isOpen && <span className="text-sm font-medium"> Home </span>}
            </a>
          </li>

          {/* Repeat for other menu items */}
        </ul>
      </div>
    </div>
  );
};

export default Sidemenu;
