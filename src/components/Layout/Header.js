import React from "react";
import Topmenu from "../Menus/Topmenu";
import Sidemenu from "../Menus/Sidemenu";

const Header = () => {
  return (
    <>
      <div className="bg-gray-900 h-50 ">
        <div className="flex">
          <Topmenu />
        </div>

        <div className="top-20">
          <Sidemenu />
        </div>
      </div>
    </>
  );
};

export default Header;
