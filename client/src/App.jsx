import React, { useState, useEffect, createContext } from 'react'
import { Routes, Route, useLocation, Navigate, Outlet, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';

import { Header } from "./components/Header"
import { Sign } from './components/Sign';
import { Navbar } from "./components/Navbar";
import { Table } from './components/Table';
import { Dashboard } from './components/Dashboard';
import { Days } from "./components/Days";
import { Admin } from './components/Admin';
import ProtectedRoutes from "./utils/ProtectedRoutes";

import "./styles/Sign.css";
import 'react-toastify/dist/ReactToastify.css';

export const finbookContext = createContext();

export const App = () => {
  const token = window.localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState([]);
  const [days, setDays] = useState(JSON.parse(window.localStorage.getItem("days")) || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [persons, setPersons] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    const verifyUser = async () => {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/users/verifyUser`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        }
      );
      const jsonResponse = await response.json();
      setLoading(false);
      if (!jsonResponse.success) {
        localStorage.clear();
        navigate("/signin");
        return toast.error(jsonResponse.message);
      }
      setUserData(jsonResponse.message);
      return;
    }
    if (token && token.length !== 0) {
      // verifyUser();
    }
  }, []);

  useEffect(() => {
    if (location.pathname.includes('days') && selectedVillage.length !== 0) {
      setSelectedVillage([]);
    }
  }, [location.pathname])




  return (
    <finbookContext.Provider value={{
      userData, setUserData, loading, setLoading,
      selectedDay, setSelectedDay, selectedVillage, setSelectedVillage,
      days, setDays, token, currentPage, setCurrentPage,
      persons, setPersons, villages, setVillages, navigate, location
    }}>
      <ToastContainer autoClose={1000} />
      <Header />
      <Routes>
        <Route path="/signin" element={token ? <Navigate to="/" /> : <Sign />}></Route>

        <Route path='/' element={<ProtectedRoutes />}>
          <Route path="/" element={<Days />}></Route>
          <Route path="days/:dayId" element={selectedDay.length === 0 ? <Navigate to="/" /> : <Navbar />}></Route>
          <Route path=':dayId/:villageId' element={(selectedDay.length === 0 || selectedVillage === "") ? <Navigate to="/" /> : <><Navbar /><Table /></>} />
          <Route path="dashboard/:user" element={userData.length!==0 ?<Dashboard /> : <Navigate to="/signin"/>}></Route>
          <Route path="admin" element={userData!==null && userData.isAdmin ? <Admin /> : <Navigate to="/"/>}/>
          <Route path="*" element={<Navigate to="/signin" />}></Route>
        </Route>
      </Routes>
    </finbookContext.Provider>
  )
}
