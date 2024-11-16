import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { finbookContext } from "../App";

const ProtectedRoutes = () => {
  const { token, location} = useContext(finbookContext)
  if (!token) {
    return <Navigate to="/signin" />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
 