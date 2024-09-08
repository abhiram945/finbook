import { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

import { Sign } from './components/Sign';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Table } from './components/Table';
import { Dashboard } from './components/Dashboard';

import './main.css';
import 'react-toastify/dist/ReactToastify.css';

export const finbookContext = createContext();

const Finbook = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedDay, setSelectedDay] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState([]);
  const [persons, setPersons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const token = window.localStorage.getItem("token");
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
      return;
    }
    if (token && token.length !== 0) {
      verifyUser();
    }
  }, []);

  const getPersonsInVillage = async () => {
    setLoading(true);
    try {
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
        return toast.error(jsonResponse.message);
      }
      return setPersons(jsonResponse.message);
    } catch (error) {
      return toast.error("Failed to reach server, try again")
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
        return toast.error(jsonResponse.message);
      }
      return setDays(jsonResponse.message);
    } catch (error) {
      setLoading(false);
      return toast.error("Failed to reach server, try again");
    }
  }

  return <BrowserRouter>
    <finbookContext.Provider value={{
      userData, setUserData, loading, setLoading,
      days, setDays, villages, setVillages,
      selectedDay, setSelectedDay, selectedVillage, setSelectedVillage,
      persons, setPersons, getPersonsInVillage, getAllDaysData,
      token, currentPage, setCurrentPage
    }}>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path='/signin' element={<Sign />} />
        <Route path='/' element={<Navbar />} />
        <Route path='/:day/:village' element={<><Navbar /><Table /></>} />
        <Route path='/:user' element={<Dashboard />} />
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </finbookContext.Provider>
  </BrowserRouter>

}

ReactDOM.createRoot(document.getElementById("root")).render(<Finbook />);