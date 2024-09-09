import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { finbookContext } from "../App";

export const ProtectedRoutes = () => {
  const {userData, token} = useContext(finbookContext)
  if (!token) {
    return <Navigate to="/signin" />;
  }
  if(userData.length===0){
    return <Navigate to="/"/>
  }
  return <Outlet />;
};
 