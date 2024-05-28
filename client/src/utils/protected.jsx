import { Outlet, Navigate } from 'react-router-dom';
import { context } from '../index';
import React, { useContext } from 'react';
export const ProtectedRoutes = () => {
    const {completeUserData}=useContext(context)
    return completeUserData ? <Outlet /> : <Navigate to="/signin" />
}

