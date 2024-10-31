import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { finbookContext } from "../App";
import { Loader } from "../utils/Loader";
import { NoUsersFound, SelectDay, SelectVillage } from "../utils/Select";
import { getPersonsInVillage, getVillagesInDay, getAllDaysData } from "../functions/helpers.js";

import "../styles/Table.css"

export const Table = () => {
  const { userData, selectedDay, setSelectedDay, selectedVillage, setSelectedVillage, loading, setLoading, persons, setPersons,
    currentPage, setCurrentPage, days, villages, setVillages, setDays
  } = useContext(finbookContext);
  const { dayId, villageId } = useParams();
  const navigate = useNavigate("/");
  const [personToBeEdited, setPersonToBeEdited] = useState();
  const [addingAmount, setAddingAmount] = useState(false);
  const [amount, setAmount] = useState("");
  const [totals, setTotals] = useState([]);

  const filteredPersons = persons.filter(person => {
    const weeksLength = person.weeks.length;
    const basePageNo = person.pageNo;
    const pagesForWeeks = Math.ceil(weeksLength / 5);
    if (person.pageNo > currentPage) {
      return false;
    }
    if (person.balance !== 0) {
      return true;
    }
    const endPage = basePageNo + pagesForWeeks - 1;
    return currentPage >= basePageNo && currentPage <= endPage;
  });

  const handleEditPerson = async (e) => {
    e.preventDefault();
    try {
      setAddingAmount(true);
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/persons/updatePerson`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dayId: selectedDay[0]._id,
            personId: personToBeEdited._id,
            amount: Number(amount),
            pageNo: Number(currentPage),
          }),
        }
      );
      const jsonResponse = await response.json();
      if (!jsonResponse.success) {
        setPersonToBeEdited(null);
        setAddingAmount(false);
        return toast.error(jsonResponse.message);
      }
      const personIndex = persons.findIndex(person => {
        return person._id === personToBeEdited._id;
      });
      if (personIndex !== -1) {
        const updatedPersons = [
          ...persons.slice(0, personIndex),
          {
            ...persons[personIndex],
            weeks: [...persons[personIndex].weeks, Number(amount)],
            paid: persons[personIndex].paid + Number(amount),
            balance: persons[personIndex].balance - Number(amount)
          },
          ...persons.slice(personIndex + 1)
        ];
        setPersons(updatedPersons);
      }
      setPersonToBeEdited(null);
      setAddingAmount(false);
      setAmount("");
      toast.success(jsonResponse.message);
      if (jsonResponse.updatingDates) {
        const {daysSuccess, daysMessage} = await getAllDaysData(userData._id);
        if (daysSuccess) {
          const newSelectedDay = daysMessage.find(d => d._id === selectedDay[0]._id);
          setDays(daysMessage);
          setSelectedDay([newSelectedDay])
          window.localStorage.setItem("daysData", JSON.stringify(daysMessage));
        }
      }
      return;
    } catch (error) {
      setPersonToBeEdited(null);
      return toast.error("Failed to Add amount, try Again.");
    }
  };

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


  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const dayInUrl = days.find(d => d._id === dayId);
        if (!dayInUrl) {
          toast.error("Day not found");
          setLoading(false);
          return navigate("/");
        }
        setSelectedDay([dayInUrl]);
        const { villagesSuccess, villagesMessage } = await getVillagesInDay(dayInUrl._id);
        if (!villagesSuccess) {
          toast.error(villagesMessage);
          setLoading(false);
          return navigate("/");
        }
        setVillages(villagesMessage);
        const villageInUrl = villagesMessage.find(v => v._id === villageId);
        if (!villageInUrl) {
          toast.error("Village not found");
          setLoading(false);
          return navigate("/");
        }
        setSelectedVillage([villageInUrl]);
        const { personsSuccess, personsMessage } = await getPersonsInVillage(villageInUrl._id);
        if (!personsSuccess) {
          toast.error(personsMessage);
          setLoading(false);
          return navigate("/");
        }
        setPersons(personsMessage);
        setLoading(false)
      } catch (error) {
        toast.error("An unexpected error occurred");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [dayId, villageId]);


  return <>
    {
      loading ? <div className="loaderContainer flex justifyCenter alignCenter"><Loader component="table" /></div>
        : (persons.length === 0 ? (selectedDay[0]._id === selectedVillage[0].dayId && <NoUsersFound day={selectedDay[0].dayName} village={selectedVillage[0].villageName} />)
          : <>
            <div className="pageNumsContainer flex justifyLeft">
              {[...Array(Math.ceil(selectedDay[0]?.dates?.length / 5))].map((_, index) => (
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
                    {selectedDay[0].dates.slice((currentPage - 1) * 5, ((currentPage - 1) * 5) + 5).map((date, dateIndex) => <th key={dateIndex}>{date?.split("T")[0]}</th>)}
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
                            <img src="/assets/paid.svg" alt="paid" />
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
                      {person.weeks.length !== 0 && person.weeks.slice((currentPage - person.pageNo) * 5, (((currentPage - person.pageNo) * 5) + 5)).map((week, i) => <td key={i} className={`col${i + 1}`}>{week}</td>)}
                    </tr>
                  ))}
                  <tr className="totalsContainer">
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
                    {addingAmount ? <Loader component="addAmount" /> : <><button type="button" onClick={() => {
                      setAmount("");
                      setPersonToBeEdited('');
                    }}
                    >Cancel</button>
                      <button type="submit">Submit</button></>}
                  </div>
                </form>
              )}
            </div>
          </>
        )
    }
  </>
}