import '../styles/Dashboard.css';
import { useContext, useEffect, useState } from "react";
import { Loader } from '../utils/Loader';
import { finbookContext } from '../main';

export const Dashboard = () => {
    const { userData, loading, days, getAllDaysData } = useContext(finbookContext);
    useEffect(() => {
        getAllDaysData();
    }, [])
    return <>
        <div className="dashboardContainer">
            <h2>Hello <span>{userData?.userName.toUpperCase()}</span>,<br />Explore everything you need right here on your dashboard</h2>
            {loading ? <Loader component="dashboard" />
                : <div className="dayCardsContainer">
                    {days.length !== 0 && days.map((dayData, index) => <div className="day flex flexColumn spaceBetween" key={index}>
                        <h3>{dayData.dayName}</h3>
                        <h3>Total : Rs <span>{dayData.totalReturn}</span></h3>
                        <h3>Collected : Rs <span>{dayData.totalCollected}</span></h3>
                        <h3>Balance : Rs <span className='balance'>{dayData.balance}</span></h3>
                    </div>)}
                </div>}
        </div>
    </>
}