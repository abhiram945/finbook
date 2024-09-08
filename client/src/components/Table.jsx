import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";

import { finbookContext } from "../App";
import { Loader } from "../utils/Loader";
import { NoUsersFound } from "../utils/Select";

import "../styles/Table.css"

export const Table = () => {
  const { selectedDay, selectedVillage, loading, setLoading, persons,setPersons,
     currentPage, setCurrentPage,
    getPersonsInVillage
  } = useContext(finbookContext);
  const [personToBeEdited, setPersonToBeEdited] = useState();
  const [amount, setAmount] = useState("");
  const [totals, setTotals] = useState([]);

  useEffect(() => {
    const tempTotals = [];
    if (persons.length === 0) return;
    for (let i = 1; i <= 5; i++) {
      const elements = Array.from(document.querySelectorAll(`.col${i}`));
      const sum = elements.reduce((prev, element) => {
        const value = parseInt(element.textContent) || 0;
        return prev + value;
      }, 0);
      tempTotals.push(sum);
    }
    setTotals(tempTotals);
  }, [currentPage, persons]);

  const filteredPersons = persons.filter(person => {
    const start = (currentPage - 1) * 5;
    const end = start + 5;
    return person.pageNo <= currentPage && person.balance!==0;
    return person.weeks.slice(start, end).length > 0 || person.balance !== 0;
  });

  const handleEditPerson = async (e) => {
    e.preventDefault();
    setLoading(personToBeEdited._id);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/persons/updatePerson`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dayId: selectedDay?._id,
            personId: personToBeEdited._id,
            amount: Number(amount),
          }),
        }
      );
      const jsonResponse = await response.json();
      if (!jsonResponse.success) {
        setLoading(false);
        return toast.error(jsonResponse.message);
      }
      const personsInVillage = await getPersonsInVillage();
      setPersons(personsInVillage);
      setLoading(false);
      setPersonToBeEdited(null);
      setAmount("");
      return toast.success(jsonResponse.message);
    } catch (error) {
      setLoading(false);
      return toast.error("Failed to Add amount, try Again.");
    }
  };

  const handleDeletePerson = async (person) => {
    setLoading(person._id);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/persons/deletePerson`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ person: person }),
        }
      );
      const jsonResponse = await response.json();
      console.log(jsonResponse)
      setLoading(false);
      if (!jsonResponse.success) {
        return toast.error(jsonResponse.message);
      }
      await getPersonsInVillage();
      toast.success(jsonResponse.message);
      return;
    } catch (error) {
      setLoading(false);
      return toast.error("Failed to reach server, try again.");
    }
  };


  return <>
    {loading ? <div className="loaderContainer flex justifyCenter alignCenter"><Loader component="table" /></div>
      : persons.length === 0 ? <NoUsersFound day={selectedDay?.dayName} village={selectedVillage?.villageName} />
        : <>
          <div className="pageNumsContainer flex justifyLeft">
            {[...Array(Math.ceil(selectedDay?.dates?.length / 5))].map((_, index) => (
              <button key={index} onClick={() => setCurrentPage(index + 1)} className={currentPage === (index + 1) ? "active" : ""}>{index + 1}</button>
            ))}
          </div>

          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Card no</th>
                  <th className="name">Name</th>
                  <th>Tot Amount</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Action</th>
                  {selectedDay?.dates.slice((currentPage - 1) * 5, ((currentPage - 1) * 5) + 5).map((date, dateIndex) => <th key={dateIndex}>{date?.split("T")[0]}</th>)}
                </tr>
              </thead>
              <tbody>
                {filteredPersons?.map((person, personIndex) => (
                  <tr key={personIndex}>
                    <td> {person.date.split("T")[0]} </td>
                    <td>{person.cardNo}</td>
                    <td className="name"> {person.personName.charAt(0).toUpperCase() + person.personName.slice(1)} </td>
                    <td className="villageAmount">{person.amountTaken}</td>
                    <td className="villagePaid">{person.paid}</td>
                    <td className="villageBalance">{person.balance}</td>
                    <td className="editTd">
                      {person.paid >= person.amountTaken ? (
                        loading === person._id ? (
                          <Loader component="table" />
                        ) : (
                          <img src="/assets/delete.svg" alt="delete" onClick={() => handleDeletePerson(person)} />
                        )
                      ) : loading === person._id ? (
                        <Loader component="table" />
                      ) : (
                        <img
                          src="/assets/edit.svg"
                          alt="edit"
                          onClick={() => {
                            setPersonToBeEdited(person);
                          }}
                        />
                      )}
                    </td>
                    {person.weeks.length !== 0 && person.weeks.slice((currentPage - person.pageNo) * 5, ((currentPage - person.pageNo) + 5)).map((week, i) => <td key={i} className={`col${i + 1}`}>{week}</td>)}
                  </tr>
                ))}
                <tr>
                  <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                  {totals.length !== 0 && totals.map((total, totalsIndex) => <td key={totalsIndex}>{total}</td>)}
                </tr>
              </tbody>
            </table>
            {personToBeEdited && (
              <form className="editContainer" onSubmit={handleEditPerson}>
                <div className="flex spaceBetween">
                  <p>Card no: {personToBeEdited.cardNo}</p>
                  <p>
                    {personToBeEdited.personName.charAt(0).toUpperCase() +
                      personToBeEdited.personName.slice(1)}
                  </p>
                </div>
                <div className="weeksInputContainer flex alignCenter">
                  <label>Add amount</label>
                  <input type="number" onChange={(e) => setAmount(e.target.value)} value={amount} autoFocus required />
                </div>
                <div className="addCancelButtonsContainer flex spaceBetween">
                  <button type="button" onClick={() => {
                    setAmount("");
                    setPersonToBeEdited('');
                  }}
                  >Cancel</button>
                  <button type="submit">Submit</button>
                </div>
              </form>
            )}
          </div>
        </>}
  </>
}