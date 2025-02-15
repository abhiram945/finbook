import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Loader } from "../utils/Loader";
import { finbookContext } from "../App";
import { SelectVillage, AddVillage } from "../utils/Select"

import "../styles/Navbar.css";

export const Navbar = () => {
  const { userData,selectedDay,setSelectedDay, selectedVillage, setSelectedVillage,
    setPersons, villages, setVillages, currentPage, setCurrentPage } = useContext(finbookContext);
  const { dayId, villageId } = useParams();
  const [adding, setAdding] = useState(false);
  const [add, setAdd] = useState("");
  const [addVillage, setAddVillage] = useState("");
  const [personFormData, setPersonFormData] = useState({
    cardNo: "",
    personName: "",
    amountTaken: "",
    date: "",
  });



  const handleAddVillageFunction = async (e) => {
    e.preventDefault();
    try {
      setAdding(true)
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/days/addVillage`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: userData._id, dayName:selectedDay[0].name, villageName: addVillage })
      });
      const jsonResponse = await response.json();
      if (!jsonResponse.success) {
        throw new Error(jsonResponse.message);
      }
      console.log(jsonResponse)
      toast.success(jsonResponse.message);
      selectedDay[0].villages.push(addVillage)
    } catch (error) {
      return toast.error(error.message);
    }finally{
      setAdd("");
      setAdding(false)
      setAddVillage("")
    }
  }


  const handleAddPersonFunction = async (e) => {
    e.preventDefault();
    try {
      setAdding(true)
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/persons/addPerson`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user:userData._id,
          dayId: selectedDay[0]._id,
          village: selectedVillage,
          name: personFormData.personName,
          cardNumber: personFormData.cardNo,
          pageNumber: currentPage,
          date: personFormData.date,
          amountOwed: personFormData.amountTaken,
        })
      });
      const jsonResponse = await response.json();
      setAdding(false);
      setAdd("")
      if (!jsonResponse.success) {
        throw new Error(jsonResponse.message);
      }
      toast.success(`${personFormData.personName} added`);
      setPersons(prev => [...prev, jsonResponse.message])
    } catch (error) {
      setAdding(false)
      return toast.error(error.message || "Failed to reach server, try again.");
    }
  }

  const handleChange = (e) => {
    setPersonFormData({ ...personFormData, [e.target.name]: e.target.value });
  };


  return (<>
    <nav className="flex spaceBetween alignCenter">
      <h2>{selectedDay[0].name?.toUpperCase()}</h2>

      <div className="villagesContainer flex alignCenter">
        {selectedDay[0].villages.length===0 ? <p>No villages added</p>:selectedDay[0].villages.map((v, index) => <NavLink key={index} to={`/${selectedDay[0]._id}/${v}`}
          onClick={() => { setSelectedVillage(v); setCurrentPage(1) }} className={villageId === v._id ? "active" : ""}>{v}</NavLink>)}
      </div>

      <div className="addIconsContainer flex alignCenter spaceEvenly">
        {selectedDay.length === 1 && <img src="/assets/addVillage.svg" alt="add village" onClick={() => { setAdd("village") }} />}
        {selectedVillage.length === 1 && selectedDay[0]._id === selectedVillage[0].dayId && <img src="/assets/addPerson.svg" alt="add village" onClick={() => {
          setAdd("person"); setPersonFormData({ cardNo: "", personName: "", amountTaken: "", date: "" });
        }} />}
      </div>

      {add === "village" && (
        <form className='addVillageForm flex flexColumn spaceBetween' onSubmit={handleAddVillageFunction}>
          <h3>Add new Village into {selectedDay[0].name.toUpperCase()}</h3>
          <input type='text' placeholder='Enter new village name' required onChange={(e) => setAddVillage(e.target.value)} autoFocus />
          <div className='addCancelButtonsContainer flex spaceEvenly'>
            {adding && add !== "" ? <Loader component="" /> : <>
              <button type='button' onClick={() => { setAdd("") }}>Cancel</button>
              <button type='submit'>Add</button>
            </>}
          </div>
        </form>
      )}

      {add === "person" && selectedDay.length !== 0 && selectedVillage.length !== 0 && (
        <form className='addPersonForm flex flexColumn spaceBetween' onSubmit={handleAddPersonFunction}>
          <h3>Add new Person into<br /> {selectedDay[0].name.toUpperCase()} - {selectedVillage[0].villageName.toUpperCase()} - {currentPage}</h3>
          <input type='number' name='cardNo' placeholder='Card no' required onChange={handleChange} value={personFormData.cardNo} autoFocus />
          <input type='text' name='personName' placeholder='Enter name' required onChange={handleChange} value={personFormData.personName} />
          <input type='number' name='amountTaken' placeholder='Enter total amount' required onChange={handleChange} value={personFormData.amount} />
          <input type='date' name='date' required onChange={handleChange} value={personFormData.date} />
          <div className='addCancelButtonsContainer flex spaceEvenly'>
            {adding && add !== "" ? <Loader component="" /> :
              <><button type='button' onClick={() => setAdd("")}>Cancel</button>
                <button type='submit'>Add</button></>
            }
          </div>
        </form>
      )}
    </nav>

    {selectedDay.length !== 0 && selectedDay[0].villages.length === 0 ? <AddVillage dayName={selectedDay[0].name} /> : selectedVillage.length === 0 && <SelectVillage />}
  </>
  )
}

export default Navbar