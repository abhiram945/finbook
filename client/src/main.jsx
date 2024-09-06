import { createContext, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

import { Sign } from './components/Sign';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Table } from './components/Table';
import { ProtectedRoutes } from './utils/protected';
import { Dashboard } from './components/Dashboard';

import './main.css';
import 'react-toastify/dist/ReactToastify.css';

const finbookContext = createContext();

const Finbook = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedDay, setSelectedDay] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState([]);
  const [persons, setPersons] = useState([])

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
    if (token) {
      verifyUser();
    }
  }, [token]);

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

  return (<>

    <ToastContainer />
    <finbookContext.Provider value={{
      navigate, location,
      userData, setUserData, loading, setLoading,
      days, setDays, villages, setVillages,
      selectedDay, setSelectedDay, selectedVillage, setSelectedVillage,
      persons, setPersons, getPersonsInVillage, getAllDaysData
    }}>
      <Header />
      <Routes>
        <Route path='/signin' element={<Sign />} />
        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={<><Navbar /><Outlet /></>}>
            <Route path='/:day/:village' element={userData.length === 0 ? <Navigate to="/" /> : <Table />} />
          </Route>
        </Route>
        <Route path='/:user' element={<Dashboard />} />
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </finbookContext.Provider>
  </>
  );
}

export { finbookContext };

const rootElement = document.getElementById('root');

const root = createRoot(rootElement);
root.render(<BrowserRouter><Finbook /></BrowserRouter>);
