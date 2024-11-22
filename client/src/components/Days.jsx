import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { finbookContext } from '../App';
import "../styles/Days.css"
import { Loader } from '../utils/Loader';
import { getAllDaysData } from '../functions/helpers';
import { toast } from 'react-toastify';
export const Days = () => {
  const { days, setDays, loading, setLoading, setSelectedDay, userData } = useContext(finbookContext);

  useEffect(() => {
    if (userData.length !== 0 && days.length === 0) {
      (async () => {
        try {
          setLoading(true);
          const { daysSuccess, daysMessage } = await getAllDaysData(userData._id);
          if (!daysSuccess) {
            throw new Error(daysMessage);
          }
          window.localStorage.setItem("daysData", JSON.stringify(daysMessage))
          setDays(daysMessage);

          setLoading(false);
        } catch (error) {
          return toast.error(error.message);
        }
      })();
    }
  }, []);
  return (
    <div className="daysContainer flex justifyCenter alignCenter">
      <div className="linksContainer flex flexColumn spaceEvenly">
        {(loading && days.length === 0) ? <Loader component="days" /> : days.map((day, index) => <Link key={index} to={`/days/${day._id}`}
          onClick={() => {
            setSelectedDay([day]);
          }}>{day.dayName}</Link>)}
      </div>
    </div>
  )
}

