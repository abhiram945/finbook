import { useParams } from "react-router-dom";
import '../styles/main.css';
import { useState, useContext, useEffect } from "react";
import { context } from "../index";
import { Loader } from "./loader";

export const Main = () => {
    const [isEditClicked, setIsEditClicked] = useState(false);
    const { day, village } = useParams();
    const { completeUserData, setCompleteUserData } = useContext(context);
    const [filteredPersons, setFilteredPersons] = useState(null);
    const [personToBeEdited, setPersonToBeEdited] = useState(null);
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState('');
    useEffect(() => {
        if (completeUserData) {
            const filteredDays = completeUserData.days?.find(dayObj => dayObj.day === day);
            const filteredVillages = filteredDays?.villages.find(villageObj => villageObj.villageName === village);
            setFilteredPersons(filteredVillages?.persons || []);
        }
    }, [village, day, completeUserData]);

    const handleEditPerson = async (e) => {
        setIsLoading(personToBeEdited.name);
        e.preventDefault();
        setIsEditClicked(!isEditClicked);
        setAmount('');
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/editPerson`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ personToBeEdited, day, village, amount })
            });
            const message = await response.json();
            if (message.message === "success") {
                setCompleteUserData(message.completeUserData)
                setIsLoading('');
            }
        } catch (error) {
            setIsLoading('');
            return alert("Failed to Add amount, Refresh the page and Try Again.");
        }
    }
    const handleDeletePerson = async (personName) => {
        setIsLoading(personName);
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/deletePerson`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ personName, day, village })
            });
            const message = await response.json();
            if (message.message === "success") {
                setCompleteUserData(message.completeUserData);
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            return    alert("Failed to delete Person, Please refresh and try again.");
        }
    }

    const getTotPaid = (weeks) => {
        const totPaid = weeks?.reduce((sum, weekObj) => sum + Number(weekObj[Object.keys(weekObj)[0]] || 0), 0);
        return totPaid || 0;
    }
    return (
        <main className="mainContainer">
            <h3>{day.toUpperCase() + " - " + village.toUpperCase()} logs details</h3>
            {filteredPersons && filteredPersons.length > 0 ? (
                <div className="tableContainer">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Card no</th>
                                <th className="name">Name</th>
                                <th>Tot Amount</th>
                                <th>Amt Paid</th>
                                <th>Balance</th>
                                <th>Action</th>
                                {[...Array(30)].map((_, index) => <th key={index}>{index + 1}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPersons.map((person, index) => (
                                <tr key={index}>
                                    <td>{person.date.split('T')[0]}</td>
                                    <td>{person.cardNo}</td>
                                    <td>{person.name.charAt(0).toUpperCase() + person.name.slice(1)}</td>
                                    <td>{person.totalAmount}</td>
                                    <td>{getTotPaid(person.weeks)}</td>
                                    <td>{person.totalAmount - getTotPaid(person.weeks)}</td>
                                    {
                                        getTotPaid(person.weeks) >= Number(person.totalAmount) ?
                                            (isLoading===person.name ? <Loader component="days" /> :
                                                <td onClick={() => { handleDeletePerson(person.name); }} className="editTd">
                                                    <img src="/assets/images/delete.svg" alt="delete" />
                                                </td>
                                            ) :
                                            (isLoading===person.name ? <Loader component="days" /> :
                                                <td onClick={() => { setIsEditClicked(!isEditClicked); setPersonToBeEdited(person); }} className="editTd">
                                                    <img src="/assets/images/edit.svg" alt="edit" />
                                                </td>
                                            )
                                    }

                                    {person.weeks ?
                                        (
                                            person.weeks.length === 30 ? (
                                                person.weeks.map((weekObj, wIndex) => (
                                                    <td key={wIndex}>{weekObj[Object.keys(weekObj)[0]]}</td>
                                                ))
                                            ) : (
                                                <>
                                                    {person.weeks.map((weekObj, wIndex) => < td key={wIndex} > {weekObj[Object.keys(weekObj)[0]]}</td>
                                                    )}
                                                    {
                                                        [...Array(30 - person.weeks.length)].map((_, i) => (
                                                            <td key={person.weeks.length + i}>-</td>
                                                        ))}
                                                </>
                                            )
                                        )
                                        :
                                        (
                                            [...Array(30)].map((_, i) => <td key={i}>-</td>)
                                        )
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="noUsersFoundContainer">
                    <p><strong>No users found in {village.toUpperCase()}</strong></p>
                    <p>click on <strong>Add Person</strong> button on the top to add a new person in <strong>{village.toUpperCase()}</strong></p>
                    <img src="/assets/images/noUsersFound.jpg" alt="noUsersFound" className="noUsersFoundImage" />
                </div>
            )}

            {
                isEditClicked && personToBeEdited && (
                    <form className="editContainer" onSubmit={handleEditPerson}>
                        <div className="flex spaceBetween">
                            <p>Card no: {personToBeEdited.cardNo}</p>
                            <p>{personToBeEdited.name.charAt(0).toUpperCase() + personToBeEdited.name.slice(1)}</p>
                        </div>
                        <div className="weeksInputContainer flex alignCenter">
                            <label>Add amount</label>
                            <input type="number" onChange={(e) => setAmount(e.target.value)} value={amount} autoFocus required />
                        </div>
                        <div className="addCancelButtonsContainer flex spaceBetween">
                            <button type="submit">Submit</button>
                            <button type="button" onClick={() => setIsEditClicked(!isEditClicked)}>Cancel</button>
                        </div>
                    </form>
                )
            }
        </main >
    );
};

