import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Loader } from "../utils/Loader";
import { finbookContext } from "../App";
import { SelectDay, SelectVillage, AddVillage } from "../utils/Select"

import "../styles/Navbar.css";

export const Navbar = () => {
  const { userData, loading, setLoading, selectedDay, setSelectedDay, selectedVillage, setSelectedVillage,
    days, setDays, setPersons, villages, setVillages, currentPage,
    getPersonsInVillage, getAllDaysData
  } = useContext(finbookContext);

  const [isAddVillageClicked, setIsAddVillageClicked] = useState(false);
  const [isAddPersonClicked, setIsAddPersonClicked] = useState(false);
  const [addVillage, setAddVillage] = useState("");
  const [addingVillage, setAddingVillage] = useState(false);
  const [gettingDays, setGettingDays] = useState(false);
  const [gettingVillages, setGettingVillages] = useState(false);
  const [personFormData, setPersonFormData] = useState({
    cardNo: "",
    personName: "",
    amountTaken: "",
    date: "",
  });



  const getVillagesInDay = async () => {
    setGettingVillages(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/villages/getVillagesInDay`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dayId: selectedDay?._id })
      });
      const jsonResponse = await response.json();
      setGettingVillages(false)
      if (!jsonResponse.success) {
        return toast.error(jsonResponse.message);
      }
      return setVillages(jsonResponse.message);
    } catch (error) {
      setGettingVillages(false);
      return toast.error("Failed to reach server, try again");
    }
  }




  const handleChange = (e) => {
    setPersonFormData({ ...personFormData, [e.target.name]: e.target.value });
  };


  const handleAddVillageFunction = async (e) => {
    e.preventDefault();
    setAddingVillage(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/villages/addVillage`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dayId: selectedDay._id, newVillageName: addVillage })
      });
      const jsonResponse = await response.json();
      setIsAddVillageClicked(false);
      setAddingVillage(false);
      if (!jsonResponse.success) {
        return toast.error(jsonResponse.message);
      }
      await getVillagesInDay();
      return toast.success(`${addVillage} added`);
    } catch (error) {
      setAddingVillage(false);
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
          dayId: selectedDay._id,
          villageId: selectedVillage._id,
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
      setPersonFormData({
        cardNo: "",
        personName: "",
        amountTaken: "",
        date: "",
      });
      const personsInVillage = await getPersonsInVillage();
      setPersons(personsInVillage);
      return toast.success(jsonResponse.message);
    } catch (error) {
      setLoading(false);
      return toast.error("Failed to reach server, try again.");
    }
  }


  useEffect(() => {
    if (userData.length !== 0) {
      (async () => { 
        const allDays = await getAllDaysData();
        setDays(allDays);
      })();
    }
  }, [userData]);

  useEffect(() => {
    if (selectedDay.length !== 0) {
      getVillagesInDay();
    }
  }, [selectedDay]);

  useEffect(() => {
    if (selectedVillage.length !== 0) {
      (
        async () => {
          const personsInVillage = await getPersonsInVillage();
          setPersons(personsInVillage);
        }
      )();
    }
  }, [selectedVillage]);



  return (<>
    <nav className="flex flexColumn">
      <div className="daysContainer flex spaceEvenly">
        {(gettingDays && days.length === 0) ? <Loader /> : days.map((day, index) => <button key={index} onClick={() => {
          setSelectedDay(day);
        }} className={selectedDay.dayName === day.dayName ? "active" : ""}>{day.dayName}</button>)}
      </div>

      <div className="villagesContainer flex justifyLeft">
        {(gettingVillages || addingVillage) ? <Loader component="navbar" /> : villages.map((village, index) => <NavLink key={index} to={`/${selectedDay.dayName}/${village.villageName}`}
          onClick={() => { setSelectedVillage(village) }}
          className={selectedVillage._id === village._id ? "active" : ""}>{village.villageName}</NavLink>)}
      </div>

      <div className="addBtnsContainer flex justifyCenter">
        {selectedDay.dayName && <button onClick={() => { setIsAddPersonClicked(false); setIsAddVillageClicked(true) }}>Add Village</button>}
        {selectedVillage?.length !== 0 && <button onClick={() => { setIsAddVillageClicked(false); setIsAddPersonClicked(true) }}>Add Person</button>}
      </div>

      {isAddVillageClicked && (
        <form className='addVillageForm flex flexColumn' onSubmit={handleAddVillageFunction}>
          <h3>Add new Village into {selectedDay?.dayName.toUpperCase()}</h3>
          <input type='text' placeholder='Enter new village name' required onChange={(e) => setAddVillage(e.target.value)} autoFocus />
          <div className='addCancelButtonsContainer flex spaceEvenly'>
            {addingVillage ? <Loader component="" /> : <>
              <button type='button' onClick={() => { setIsAddVillageClicked(false) }}>Cancel</button>
              <button type='submit'>Add</button>
            </>}
          </div>
        </form>
      )}

      {isAddPersonClicked && selectedDay.length !== 0 && selectedVillage.length !== 0 && (
        <form className='addPersonForm flex flexColumn' onSubmit={handleAddPersonFunction}>
          <h3>Add new Person into<br /> {selectedDay?.dayName.toUpperCase()} - {selectedVillage?.villageName.toUpperCase()} - {currentPage}</h3>
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
    {selectedDay.length === 0 && <SelectDay />}
    {selectedDay.length !== 0 && selectedVillage.length === 0 && villages.length !== 0 && <SelectVillage />}
    {selectedDay.length !== 0 && (typeof selectedVillage === "object") && villages.length === 0 && <AddVillage dayName={selectedDay?.dayName} />}
  </>
  )
}

export default Navbar