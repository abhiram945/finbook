import React, { useState, useEffect, createContext } from 'react'
import { Routes, Route, useNavigate, NavLink } from "react-router-dom"
import { ToastContainer,toast } from 'react-toastify';

import { Header } from "./components/Header"
import { Sign } from './components/Sign';
import { Navbar } from "./components/Navbar";
import { Table } from './components/Table';
import "./styles/Sign.css";
import 'react-toastify/dist/ReactToastify.css';
import { Dashboard } from './components/Dashboard';

export const finbookContext = createContext();

export const App = () => {
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState([]);
  const [days, setDays] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [persons, setPersons] = useState([]);
  const [villages, setVillages] = useState([]);

  const getPersonsInVillage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/persons/getPersonsInVillage`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ villageId: selectedVillage._id })
      });
      const jsonResponse = await response.json();
      setLoading(false);
      if (!jsonResponse.success) {
        toast.error(jsonResponse.message);
        return [];
      }
      return jsonResponse.message;
    } catch (error) {
      setLoading(false);
      toast.error("Failed to reach server, try again");
      return [];
    }
  }

  const getAllDaysData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/days/getAllDaysData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userData?._id })
      });
      const jsonResponse = await response.json();
      setLoading(false);
      if (!jsonResponse.success) {
        toast.error(jsonResponse.message);
        return [];
      }
      return jsonResponse.message;
    } catch (error) {
      setLoading(false);
      toast.error("Failed to reach server, try again");
      return [];
    }
  }

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
        return toast.error(jsonResponse.message);
      }
      setUserData(jsonResponse.message);
      navigate("/");
      return;
    }
    if (token && token.length !== 0) {
      verifyUser();
    }
  }, []);

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault(); 
      navigate('/');
      setSelectedDay([]);
      setSelectedVillage([]);
      setVillages([])
      setPersons([]);
    };
    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [selectedVillage]);


  return (
    <finbookContext.Provider value={{
      userData, setUserData, loading, setLoading,
      selectedDay, setSelectedDay, selectedVillage, setSelectedVillage,
      days, setDays, token, currentPage, setCurrentPage,
      persons, setPersons, villages, setVillages,
      getPersonsInVillage, getAllDaysData
    }}>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Navbar />}></Route>
        <Route path="/signin" element={<Sign />}></Route>
        <Route path='/:day/:village' element={(userData.length===0 ||selectedDay.length===0||selectedVillage.length===0) ? <NavLink to="/"/>:<><Navbar /><Table /></>} />
        <Route path="/:user" element={userData.length===0 ?<NavLink to="/"/>:<Dashboard />}></Route>
      </Routes>
    </finbookContext.Provider>
  )
}
