import '../styles/Dashboard.css';
import { useContext, useEffect } from "react";
import { Loader } from '../utils/Loader';
import { finbookContext } from '../App';
import { getAllDaysData } from '../functions/helpers.js';
import { toast } from 'react-toastify';

export const Dashboard = () => {
  const { userData, loading, days, setDays, setLoading } = useContext(finbookContext);
  useEffect(() => {
    const getAllDaysDataFunc = async () => {
      try {
        setLoading(true)
        const { daysSuccess, daysMessage } = await getAllDaysData(userData._id);
        setLoading(false)
        if (!daysSuccess) {
          throw new Error(daysMessage);
        }
        window.localStorage.setItem("daysData", JSON.stringify(daysMessage));
        setDays(daysMessage);
      } catch (error) {
        return toast.error(error.message);
      }

    }
    getAllDaysDataFunc();
  }, []);
  const dayShortNames=["Sun","Mon","Tues","Wed","Thu","Fri","Sat"]
  return <>
    <div className="dashboardContainer">
      <h2>Hello <span>{userData?.userName.toUpperCase()}</span>,<br />Explore everything you need right here on your dashboard</h2>
      {loading ? <Loader component="dashboard" />
        :
        <table>
          <thead>
            <tr>
            <th>Day</th>
            <th>Total</th>
            <th>Collected</th>
            <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {days.length !== 0 && days.map((dayData, index) => <tr key={index}>
              <td>{window.innerWidth<400 ? dayShortNames[index]:  dayData.dayName}</td>
              <td>{dayData.totalReturn}</td>
              <td>{dayData.totalCollected}</td>
              <td>{dayData.balance}</td>
            </tr>)}
          </tbody>
        </table>
      }
    </div>
  </>
}