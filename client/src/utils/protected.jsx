import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { finbookContext } from '../main';
export const ProtectedRoutes = () => {
    const token = window.localStorage.getItem("token");
    const {userData} = useContext(finbookContext);
        return (token) ? <Outlet/> : <Navigate to="/signin"/>
}

