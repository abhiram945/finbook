import React,{useEffect} from 'react'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { finbookContext } from '../App';
import "../styles/Days.css"
import { Loader } from '../utils/Loader';
import { getAllDaysData } from '../functions/helpers';
export const Days = () => {
    const { days,setDays, loading,setLoading, setSelectedDay, userData } = useContext(finbookContext);

    useEffect(() => {
        if (userData.length !== 0 && days.length === 0) {
          (async () => {
            setLoading(true);
            const { daysSuccess, daysMessage } = await getAllDaysData(userData._id);
            if (!daysSuccess) {
              toast.error(daysMessage);
            } else {
              window.localStorage.setItem("daysData", JSON.stringify(daysMessage))
              setDays(daysMessage);
            }
            setLoading(false);
          })();
        }
      }, []);
    return (
        <div className="daysContainer flex flexColumn spaceEvenly">
            {(loading && days.length === 0) ? <Loader component="days" /> : days.map((day, index) => <Link key={index} to={`/days/${day._id}`}
            onClick={() => {
                setSelectedDay([day]);
            }}>{day.dayName}</Link>)}
        </div>
    )
}

