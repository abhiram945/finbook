import React, { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify';
import { Loader } from '../utils/Loader';
import { finbookContext } from '../App';

import "../styles/Admin.css"

export const Admin = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const { userData } = useContext(finbookContext);

    const getAllUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/users/getAllUsers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userData })
            });
            const jsonResponse = await response.json();
            if (!jsonResponse.success) {
                throw new Error(jsonResponse.message);
            }
            setAllUsers(jsonResponse.message)
            return;
        } catch (error) {
            return toast.error(error.message || "Slow internet");
        }
    }
    useEffect(() => {
        getAllUsers();
    }, []);

    const deleteUserAccount = async (userId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/users/deleteUserAccount`, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userId })
            })
            const jsonResponse = await response.json();
            if (!jsonResponse.success) {
                throw new Error(jsonResponse.message);
            }
            const updatedAllUsers = allUsers.filter(user => user._id !== userId);
            setAllUsers(updatedAllUsers);
            return toast.success(jsonResponse.message);
        } catch (error) {
            setDeleting(-1);
            return toast.error(error.message || "Slow internet");
        }
    }
    return (<div className='adminContainer'>
            {allUsers.length !== 0 ? (
                <>
                    <div className='flex alignCenter userCount'>
                        <h3>{allUsers.length}</h3>
                        <p>Users registered</p>
                    </div>
                    <table className='adminTable'>
                        <thead>
                            <tr><th>S.No</th><th>User Id</th><th>Gmail</th><th>User Name</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {allUsers.map((user, index) => (
                                <tr key={user._id}>
                                <td>{index + 1}</td><td>{user._id}</td><td>{user.gmail}</td><td>{user.userName}</td><td>
                                    {deleting === user._id ? (
                                        <Loader component="adminDelete" />
                                    ) : (
                                        <button className='deleteBtn' onClick={() => { setDeleting(user._id); deleteUserAccount(user._id) }}>Delete</button>
                                    )}
                                </td>
                            </tr>                            
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <Loader component="dashboard" />
            )}
        </div>

    )
}

