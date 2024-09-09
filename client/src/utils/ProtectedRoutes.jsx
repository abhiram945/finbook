import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { finbookContext } from "../App";

const ProtectedRoutes = () => {
  const {userData, token} = useContext(finbookContext)
  if (!token) {
    return <Navigate to="/signin" />;
  }
  if(token && userData.length===0){
    return <Navigate to="/"/>
  }
  return <Outlet />;
};

export default ProtectedRoutes;
 