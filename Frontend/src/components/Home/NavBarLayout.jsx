import React from "react";
import NavBar from "./NavBar";
import { Outlet, useLocation } from "react-router-dom";

const NavBarLayout = () => {
  const location = useLocation();
  const backgroundImage =
    location.pathname === "/" ? "/home.jpeg" : "/home2.jpg";
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <NavBar />
      <Outlet />
    </div>
  );
};

export default NavBarLayout;
