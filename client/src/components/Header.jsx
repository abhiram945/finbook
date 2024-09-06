import { NavLink } from "react-router-dom"
import {useContext} from "react"
import { finbookContext } from '../main';
import "../styles/Header.css";
import "../main.css";
export const Header = () => {
    const {userData} = useContext(finbookContext)
    return <header className="flex spaceBetween alignCenter">
        <NavLink to="/" className="flex alignCenter"><img src="/assets/logo.svg" /><h1>FinBook</h1></NavLink>
        {userData.length!==0 && <div className="userOptions flex spaceBetween">
            <NavLink to={`/${userData.userName}`}>Dashboard</NavLink>
            <NavLink to="/signin" onClick={() => window.localStorage.clear()}>SignOut</NavLink>
        </div>}
    </header>
}