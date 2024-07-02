import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectUserData } from "../../redux/reducers/authReducers";

const RedirectIfAuthenticated = () => {
  const user = useSelector(selectUserData);
  return user?.status ? <Navigate to="/"/> : <Outlet />;
};

export default RedirectIfAuthenticated;
