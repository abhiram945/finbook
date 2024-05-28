import '../styles/header.css';
import { NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import { context } from '..';
export const Header = () => {
    const {completeUserData, setCompleteUserData}=useContext(context);
    const [profileClicked, setProfileClicked] = useState(false);
    const handleProfileClick = () => {
        setProfileClicked(!profileClicked);
    };
    const handleSignOut = () => {
        setProfileClicked(false);
        setCompleteUserData(null);
    }
    return <header className="flex spaceBetween alignCenter">
        <h1>FinBook</h1>
        {completeUserData &&<>
            <nav className='navProfileIcon' onClick={handleProfileClick}>
                <h3>{completeUserData.username?.slice(0,2).toUpperCase()}</h3>
            </nav>
            {profileClicked &&
                <div className='navProfileOptions'>
                    <NavLink to="/">{completeUserData.username.toUpperCase()}</NavLink>
                    <NavLink to="/signin" onClick={handleSignOut}>Sign Out</NavLink>
                </div>
            }</>
        }
    </header>
}