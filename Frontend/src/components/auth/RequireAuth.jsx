import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectUserData } from "../../redux/reducers/authReducers";
import Loading from "../common/Loading";

const RequireAuth = () => {
  const user = useSelector(selectUserData);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [user?.status]);

  if (isLoading) {
    return <Loading />;
  }
  return user?.status ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
