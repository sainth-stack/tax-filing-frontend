import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./css/Layout.css"; // Import the CSS file
import Sidemenu from "../Menus/Sidemenu";
import Topmenu from "../Menus/Topmenu";

const Layout = ({ children }) => {
  return (
    <>
      <div className="justify-center w-full">
        <div className="header  w-full shadow-md ">
          <Topmenu />
        </div>
        <div className="flex  ">
          <div className="sidemenu w-20">
            <Sidemenu />
          </div>
          <div className="flex flex-col h-screen   w-full">
            <main className="flex-1">{children}</main>

            <div className="m-3 p-3">{/* <Footer /> */}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
