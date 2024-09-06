import '../styles/Dashboard.css';
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader } from '../utils/loader';
import { finbookContext } from '../main';

export const Dashboard = () => {
    const { userData, loading, days, getAllDaysData} = useContext(finbookContext);
    useEffect(()=>{
        getAllDaysData();
    },[])
    return <>
        <div className="dashboardContainer">
            <h2>Hello <span>{userData?.userName.toUpperCase()}</span>,<br />Explore everything you need right here on your dashboard</h2>
            {loading ? <Loader component="dashboard"/>:<div className="daysContainer">
                {days.length!==0 && days.map((dayData,index)=><div className="day flex flexColumn spaceBetween" key={index}>
                    <div className='flex spaceBetween alignCenter dayTitleContainer'>
                        <p>Balance</p>
                        <h3>{dayData.dayName}</h3>
                    </div>
                    <h2 className='balance'>Rs {dayData.balance}</h2>
                    <div className='flex alignDown justifyRight totalsContainer'>
                        <h3 className='collected'>{dayData.totalCollected}</h3><span>/</span><h3 className='return'>{dayData.totalReturn}</h3>
                    </div>
                </div>)}
            </div>}
        </div>
    </>
}