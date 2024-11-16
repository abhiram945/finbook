import { NavLink } from "react-router-dom"
import { useContext } from "react"
import { finbookContext } from '../App';
import "../styles/Header.css";
export const Header = () => {
    const { userData, setUserData, setSelectedDay, setSelectedVillage, setDays, setVillages, setPersons } = useContext(finbookContext);
    return <header className="flex spaceBetween alignCenter">
        <NavLink to="/" className="flex alignCenter"><img src="/assets/logo.svg" /><h1>FinBook</h1></NavLink>
        {userData.length !== 0 && <div className="userOptions flex spaceBetween">
            <NavLink to={`/dashboard/${userData.userName}`}>Dashboard</NavLink>
            <NavLink onClick={() => {
                window.localStorage.clear(); setUserData([]);
                setPersons([]);
                setSelectedVillage([]);
                setSelectedDay([]);
                setVillages([]); setDays([]);
            }} to="/signin">SignOut</NavLink>
            {userData.gmail === import.meta.env.VITE_ADMIN && <NavLink to="/admin" className="admin">Admin</NavLink>}
        </div>}
    </header>
}