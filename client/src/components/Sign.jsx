import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Loader } from '../utils/Loader';
import { finbookContext } from '../main';
import "../styles/Sign.css";

export const Sign = () => {
    const navigate = useNavigate();
    const { setUserData, loading, setLoading, token } = useContext(finbookContext);
    const [formData, setFormData] = useState({
        gmail: 'abhi@gmail.com',
        password: 'finbook@123'
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        if (!formData.gmail || !formData.gmail.includes('@gmail.com')) {
            return toast.error('Invalid GMail');
        }
        if (!formData.password) {
            return toast.error("Please enter password")
        }
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/users/registerOrLogin`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const jsonResponse = await response.json();
            if (!jsonResponse.success) {
                setLoading(false)
                return toast.error(jsonResponse.message)
            }
            window.localStorage.setItem("token", jsonResponse.jwt)
            const data = { ...jsonResponse.message, isNew: jsonResponse.isNew };
            setUserData(data);
            setLoading(false);
            navigate("/");
        } catch (error) {
            return toast.error("Failed to reach server, try again");
        }
    };
    return <div className="signPageContainer flex alignCenter justifyCenter">
        <div className='signCardContainer flex flexColumn spaceBetween'>
            <div className="signMessageContainer flex flexColumn alignCenter justifyCenter">
                <img src='/assets/logo.svg' alt='logo' />
                <h3>Your Go-To Source for </h3>
                <h2>Finance management</h2>
                <p>Create an Account / Sign In</p>
            </div>
            <form className="signFormContainer flex flexColumn alignCenter spaceBetween" method="POST" onSubmit={handleCreateAccount}>
                <input type="gmail" name='gmail' placeholder="Enter your GMail ID" onChange={handleChange} value={formData.gmail} />
                <input type="password" name='password' placeholder="Enter password" onChange={handleChange} value={formData.password} />
                <NavLink to="/reset-password">Forgot password?</NavLink>
                {loading ? <Loader component="signIn" /> : <button type='submit'>Continue</button>}
            </form>
            <div className='author flex alignCenter'>
                <p>Designed and Developed by <a href="https://abhiram945.vercel.app" target='_blank' rel="noreferrer">Abhi <span> &#8599;</span></a></p>
            </div>
        </div>
    </div>
}