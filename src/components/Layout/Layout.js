import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./css/Layout.css"; // Import the CSS file
import Sidemenu from "../Menus/Sidemenu";
import Topmenu from "../Menus/Topmenu";

const Layout = ({ children }) => {
  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="" style={{ paddingLeft:'200px' }}>
          <div className="shadow-md fixed top-0 z-9999" style={{width:"calc(100% - 200px)",background:'white'}}>
            <Topmenu />
          </div>
        </header>
        <div className="flex flex-grow pt-16" style={{}}> {/* Add padding to account for the fixed header */}
          <aside className="w-25 bg-gray-100 shadow-md h-full fixed left-0 pt-16"> {/* Adjust padding for the fixed header */}
            <Sidemenu />
          </aside>
          <div className="flex flex-col flex-grow" style={{marginLeft:'200px'}}>
            <main className="flex-1 p-4">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
