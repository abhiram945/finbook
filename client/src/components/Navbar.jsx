import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Loader } from "../utils/Loader";
import { finbookContext } from "../App";
import { SelectVillage, AddVillage } from "../utils/Select"
import { getVillagesInDay } from "../functions/helpers.js";

import "../styles/Navbar.css";

export const Navbar = () => {
  const { userData, setUserData, loading, setLoading, selectedDay, setSelectedDay, selectedVillage, setSelectedVillage,
    days, setDays, setPersons, villages, setVillages, currentPage, setCurrentPage
  } = useContext(finbookContext);
  const { dayId, villageId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAddVillageClicked, setIsAddVillageClicked] = useState(false);
  const [isAddPersonClicked, setIsAddPersonClicked] = useState(false);
  const [addVillage, setAddVillage] = useState("");
  const [gettingVillages, setGettingVillages] = useState(false);
  const [personFormData, setPersonFormData] = useState({
    cardNo: "",
    personName: "",
    amountTaken: "",
    date: "",
  });



  const handleAddVillageFunction = async (e) => {
    e.preventDefault();
    try {
      setGettingVillages(true);
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/villages/addVillage`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dayId: selectedDay[0]._id, newVillageName: addVillage })
      });
      const jsonResponse = await response.json();
      setIsAddVillageClicked(false);
      if (!jsonResponse.success) {
        return toast.error(jsonResponse.message);
      }
      toast.success(`${addVillage} added`);
      setVillages(prev=>[...prev,jsonResponse.message]);
      setGettingVillages(false)
    } catch (error) {
      return toast.error("Failed to reach server, try again");
    }
  }


  const handleAddPersonFunction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/persons/addPerson`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dayId: selectedDay[0]._id,
          villageId: selectedVillage[0]._id,
          newCardNo: personFormData.cardNo,
          pageNo: currentPage,
          date: personFormData.date,
          personName: personFormData.personName,
          amountTaken: personFormData.amountTaken,
        })
      });
      const jsonResponse = await response.json();
      if (!jsonResponse.success) {
        setLoading(false);
        return toast.error(jsonResponse.message);
      }
      setIsAddPersonClicked(!isAddPersonClicked);
      toast.success(jsonResponse.message.personName+" added");
      setPersonFormData({ cardNo: "", personName: "", amountTaken: "", date: "" });
      setPersons(prev=>[...prev,jsonResponse.message])
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return toast.error("Failed to reach server, try again.");
    }
  }

  const handleChange = (e) => {
    setPersonFormData({ ...personFormData, [e.target.name]: e.target.value });
  };

  useEffect(()=>{
    setGettingVillages(true);
    (async()=>{
      const {villagesSuccess, villagesMessage}=await getVillagesInDay(selectedDay[0]._id);
      setGettingVillages(false)
      if(!villagesSuccess){
        toast.error(villagesMessage);
        return;
      }
      setVillages(villagesMessage);
    })();
  },[dayId])


  return (<>
    <nav className="flex flexColumn">
      <div className="dayNameContainer">
        <h2>{selectedDay[0].dayName.toUpperCase()}</h2>
      </div>

      <div className="villagesContainer flex justifyLeft">
        {gettingVillages ? <Loader component="days" /> : villages.length !== 0 && villages.map((v, index) => <NavLink key={index} to={`/${selectedDay[0]._id}/${v._id}`}
          onClick={() => { setSelectedVillage([v]); setCurrentPage(1) }} className={villageId === v._id ? "active" : ""}>{v.villageName}</NavLink>)}
      </div>

      <div className="addBtnsContainer flex justifyCenter">
        {selectedDay.length === 1 && <button onClick={() => { setIsAddPersonClicked(false); setIsAddVillageClicked(true) }}>Add Village</button>}
        {selectedVillage.length === 1 && selectedDay[0]._id === selectedVillage[0].dayId && <button onClick={() => { setIsAddVillageClicked(false); setIsAddPersonClicked(true) }}>Add Person</button>}
      </div>

      {isAddVillageClicked && (
        <form className='addVillageForm flex flexColumn' onSubmit={handleAddVillageFunction}>
          <h3>Add new Village into {selectedDay[0].dayName.toUpperCase()}</h3>
          <input type='text' placeholder='Enter new village name' required onChange={(e) => setAddVillage(e.target.value)} autoFocus />
          <div className='addCancelButtonsContainer flex spaceEvenly'>
            {loading ? <Loader component="" /> : <>
              <button type='button' onClick={() => { setIsAddVillageClicked(false) }}>Cancel</button>
              <button type='submit'>Add</button>
            </>}
          </div>
        </form>
      )}

      {isAddPersonClicked && selectedDay.length !== 0 && selectedVillage.length !== 0 && (
        <form className='addPersonForm flex flexColumn' onSubmit={handleAddPersonFunction}>
          <h3>Add new Person into<br /> {selectedDay[0].dayName.toUpperCase()} - {selectedVillage[0].villageName.toUpperCase()} - {currentPage}</h3>
          <input type='number' name='cardNo' placeholder='Card no' required onChange={handleChange} value={personFormData.cardNo} autoFocus />
          <input type='text' name='personName' placeholder='Enter name' required onChange={handleChange} value={personFormData.personName} />
          <input type='number' name='amountTaken' placeholder='Enter total amount' required onChange={handleChange} value={personFormData.amount} />
          <input type='date' name='date' required onChange={handleChange} value={personFormData.date} />
          <div className='addCancelButtonsContainer flex spaceEvenly'>
            {loading ? <Loader component="" /> :
              <><button type='button' onClick={() => setIsAddPersonClicked(false)}>Cancel</button>
                <button type='submit'>Add</button></>
            }
          </div>
        </form>
      )}
    </nav>

    {selectedDay.length !== 0 && villages.length === 0 ? <AddVillage dayName={selectedDay[0].dayName} /> : selectedVillage.length === 0 && <SelectVillage />}
  </>
  )
}

export default Navbar