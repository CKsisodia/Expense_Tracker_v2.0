import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

const NavBarLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default NavBarLayout;
