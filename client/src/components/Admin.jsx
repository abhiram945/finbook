import React, {useEffect, useState} from 'react'
import { toast } from 'react-toastify';
import { Loader } from '../utils/Loader';

import "../styles/Admin.css"

export const Admin = () => {
    const [allUsers, setAllUsers]=useState([]);
    const [deleting, setDeleting] = useState(false);
    const getAllUsers=async()=>{
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/users/getAllUsers`);
            const jsonResponse = await response.json();
            setAllUsers(jsonResponse.message)
            return;
        } catch (error) {
            return toast.error("Slow internet");
        }
    }
    useEffect(()=>{
        getAllUsers();
    },[]);

    const deleteUserAccount=async(userId)=>{
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/users/deleteUserAccount`,{
                method:"post",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({userId:userId})
            })
            const jsonResponse = await response.json();
            setDeleting(-1);
            if(!jsonResponse.success){
                return toast.error(jsonResponse.message);
            }
            getAllUsers();
            return toast.success(jsonResponse.message);
        } catch (error) {
            setDeleting(-1);
            return toast.error("Slow internet")
        }
    }
  return (
    <div className='flex justifyCenter adminContainer'>
        {allUsers.length!==0 ? allUsers.map((user,index)=><div className='flex flexColumn spaceEvenly userContainer' key={user._id}>
            <p>id : {user._id}</p>
            <h2>Username : {user.userName}</h2>
            <h3>Gmail : {user.gmail}</h3>
            {deleting===user._id ?<Loader component="adminDelete"/> :<button className='deleteBtn' onClick={()=>{setDeleting(user._id);deleteUserAccount(user._id)}}>Delete</button>}
        </div>):
        <Loader component="dashboard" />}
    </div>
  )
}

