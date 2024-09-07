import { Navigate, Outlet } from 'react-router-dom';
export const ProtectedRoutes = () => {
    const token = window.localStorage.getItem("token");
        return (token) ? <Outlet/> : <Navigate to="/signin"/>
}
