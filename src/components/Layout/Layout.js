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
        <header className="" style={{ paddingLeft: "200px" }}>
          <div
            className="shadow-md"
            style={{ width: "calc(100%)", background: "white" }}
          >
            <Topmenu />
          </div>
        </header>
        <div className="flex flex-grow" style={{}}>
          <aside className="w-25 bg-gray-100 shadow-md h-full fixed left-0 pt-16">
            <Sidemenu />
          </aside>
          <div
            className="flex flex-col flex-grow"
            style={{ marginLeft: "200px" }}
          >
            <main className="flex-1 p-4">{children}</main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
