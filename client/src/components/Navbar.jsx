import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Loader } from "../utils/Loader";
import { finbookContext } from "../App";
import { SelectDay, SelectVillage, AddVillage } from "../utils/Select"
import { getVillagesInDay, getPersonsInVillage, getAllDaysData } from "../functions/helpers.js";

import "../styles/Navbar.css";

export const Navbar = () => {
  const { userData, loading, setLoading, selectedDay, setSelectedDay, selectedVillage, setSelectedVillage,
    days, setDays, setPersons, villages, setVillages, currentPage,
  } = useContext(finbookContext);
  const { day, village } = useParams();
  const [isAddVillageClicked, setIsAddVillageClicked] = useState(false);
  const [isAddPersonClicked, setIsAddPersonClicked] = useState(false);
  const [addVillage, setAddVillage] = useState("");
  const [dayChanged, setDayChanged] = useState(false);
  const [villageChanged, setVillageChanged] = useState(false);
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
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/villages/addVillage`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dayId: selectedDay._id, newVillageName: addVillage })
      });
      const jsonResponse = await response.json();
      setIsAddVillageClicked(false);
      if (!jsonResponse.success) {
        return toast.error(jsonResponse.message);
      }
      toast.success(`${addVillage} added`);
      const { success, message } = await getVillagesInDay(selectedDay[0]._id);
      if (!success) {
        toast.error(message);
      } else {
        setVillages(message);
      }
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
      toast.success(jsonResponse.message);
      setPersonFormData({ cardNo: "", personName: "", amountTaken: "", date: "" });
      const { success, message } = await getPersonsInVillage();
        if (!success) {
          toast.error(message);
        } else {
          setPersons(message);
        }
    } catch (error) {
      setLoading(false);
      return toast.error("Failed to reach server, try again.");
    }
  }

  const handleChange = (e) => {
    setPersonFormData({ ...personFormData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (userData.length !== 0 && days.length === 0) {
      (async () => {
        const {daysSuccess, daysMessage}= await getAllDaysData(userData._id);
        if(!daysSuccess){
          toast.error(daysMessage);
        }else{
          window.localStorage.setItem("daysData", JSON.stringify(daysMessage))
          setDays(daysMessage);
        }
      })();
    }
  }, [userData]);

  useEffect(() => {
    if (dayChanged && selectedDay.length !== 0) {
      (async () => {
        setGettingVillages(true);
        const { villagesSuccess, villagesMessage } = await getVillagesInDay(selectedDay[0]._id);
        if (!villagesSuccess) {
          toast.error(villagesMessage);
        } else {
          setVillages(villagesMessage);
          const villageInUrl = villagesMessage.find(v=>v._id===village);
          if(villageInUrl!==undefined && selectedVillage.length===0){
            setSelectedVillage([villageInUrl])
          }else if(villageInUrl!==undefined && selectedVillage.length!==0 && selectedVillage[0]._id!==villageInUrl._id){
            setSelectedVillage([villageInUrl])
          }
        }
        setGettingVillages(false);
        setDayChanged(false);
      })()
    }
  }, [dayChanged]);


  useEffect(() => {
    if (villageChanged && selectedVillage.length !== 0) {
      (async () => {
        setLoading(true)
        const { personsSuccess, personsMessage } = await getPersonsInVillage(selectedVillage[0]._id);
        if (!personsSuccess) {
          toast.error(personsMessage);
        } else {
          setPersons(personsMessage);
        }
        setLoading(false);
        setVillageChanged(false)
      })()
    }
  }, [villageChanged]);


  return (<>
    <nav className="flex flexColumn">

      <div className="daysContainer flex spaceEvenly">
        {(loading && days.length === 0) ? <Loader component="days" /> : days.map((day, index) => <button key={index} onClick={() => {
          setSelectedDay([day]); setDayChanged(true);
        }} className={selectedDay[0]?._id === day._id ? "active" : ""}>{day.dayName}</button>)}
      </div>

      <div className="villagesContainer flex justifyLeft">
        {gettingVillages ? <Loader component="days" /> : villages.length !== 0 && villages.map((v, index) => <NavLink key={index} to={`/${selectedDay[0]._id}/${v._id}`}
        onClick={()=>{setSelectedVillage([v]); setVillageChanged(true)}} className={village === v._id ? "active" : ""}>{v.villageName}</NavLink>)}
      </div>

      <div className="addBtnsContainer flex justifyCenter">
        {selectedDay.length===1 && <button onClick={() => { setIsAddPersonClicked(false); setIsAddVillageClicked(true) }}>Add Village</button>}
        {selectedVillage.length === 1 && <button onClick={() => { setIsAddVillageClicked(false); setIsAddPersonClicked(true) }}>Add Person</button>}
      </div>

      {isAddVillageClicked && (
        <form className='addVillageForm flex flexColumn' onSubmit={handleAddVillageFunction}>
          <h3>Add new Village into {selectedDay?.dayName.toUpperCase()}</h3>
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
    {selectedDay.length !== 0 && villages.length === 0 && <AddVillage dayName={selectedDay[0].dayName} />}
    {selectedDay.length !== 0 && villages.length!==0 && selectedVillage.length === 0 && <SelectVillage />}
  </>
  )
}

export default Navbar