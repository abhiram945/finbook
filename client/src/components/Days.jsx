import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { finbookContext } from '../App';
import "../styles/Days.css"
import { Loader } from '../utils/Loader';
import { toast } from 'react-toastify';
export const Days = () => {
  const { days, setDays, loading, setLoading, setSelectedDay, userData } = useContext(finbookContext);

  const getAllDaysData = async()=> {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/days/getDays/${userData._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const jsonResponse = await response.json();
      if(!jsonResponse.success){
        throw new Error(jsonResponse.message)
      }
      window.localStorage.setItem("days",JSON.stringify(jsonResponse.message))
      setDays(jsonResponse.message);
    } catch (error) {
      return toast.error(error.message)
    }finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    if (userData.length !== 0 && days.length === 0) {
      getAllDaysData()
    }
  }, []);
  return (
    <div className="daysContainer flex justifyCenter alignCenter">
      <div className="linksContainer flex flexColumn spaceEvenly">
        {(loading && days.length === 0) ? <Loader component="days" /> : days.map((day, index) => <Link key={index} to={`/days/${day._id}`}
          onClick={() => {
            setSelectedDay([day]);
          }}>{day.name?.toUpperCase()}</Link>)}
      </div>
    </div>
  )
}

