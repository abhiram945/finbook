import '../styles/nav.css';
import { useState, useContext, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { context } from '../index';
import { Loader } from './loader';
export const Nav = () => {
    const { completeUserData, isNewUser, setCompleteUserData } = useContext(context);
    const { day, village } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState(day !== "" || " " ? day : null);
    const [addInto, setAddInto] = useState(null);
    const [selectedDayObj, setSelectedDayObj] = useState([]);
    const [isAddVillageClicked, setIsAddVillageClicked] = useState(false);
    const [isAddPersonClicked, setIsAddPersonClicked] = useState(false);
    const [addVillageFormName, setaddVillageFormName] = useState("");
    const [personFormData, setPersonFormData] = useState({
        cardNo: "",
        personName: "",
        totalAmount: "",
        villageName: "",
        givenDate: "",
    });
    personFormData.day = day;
    personFormData.villageName = village;

    const handleChange = (e) => {
        setPersonFormData({ ...personFormData, [e.target.name]: e.target.value });
    };
    useEffect(() => {
        const fetchDayObj = async () => {
            let newObj = completeUserData.days.filter(dayObj => dayObj.day === selectedDay)[0];
            setSelectedDayObj(newObj);
        };
        fetchDayObj();
    }, [selectedDay, completeUserData]);


    const handleAddVillageFunction = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/addVillage`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ day: addInto || selectedDay, villageName: addVillageFormName, userName: completeUserData.username })
            });
            const message = await response.json();
            if (message.message === "success") {
                setCompleteUserData(message.completeUserData);
                setIsLoading(false);
                setSelectedDay(addInto);
            }
            setIsAddVillageClicked(!isAddVillageClicked);
        } catch (error) {
            setIsLoading(false);
            return alert("An error occured, Please try again.")
        }
    }

    const handleAddPersonFunction = async (e) => {
        setIsLoading(true)
        e.preventDefault();
        const [year, month, day] = personFormData.givenDate.toString().split('-');
        personFormData.givenDate = `${day}-${month}-${year}`;
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/addPerson`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ personFormData })
            });
            const message = await response.json();
            if (message.message === "success") {
                setCompleteUserData(message.completeUserData);
                setIsLoading(false);
                setIsAddPersonClicked(!isAddPersonClicked);
                setPersonFormData({
                    cardNo: "",
                    personName: "",
                    totalAmount: "",
                    villageName: "",
                    givenDate: "",
                })
            }
        } catch (error) {
            setIsAddPersonClicked(!isAddPersonClicked);
            setIsLoading(false);
            return alert("An error occured, Please try again.");
        }
    }


    return (<>
        <nav className="navContainer flex flexColumn spaceBetween">
            {/* Days Buttons */}
            <div className='daysContainer flex spaceEvenly alignCenter'>
                {completeUserData.days ? completeUserData.days.map((d, index) => (
                    <button key={index} className={selectedDay === d.day ? "active" : ""}
                        onClick={() => {
                            const villagesInSelectedDay = completeUserData.days.filter(dayObj => dayObj.day === d.day)[0].villages;
                            if (villagesInSelectedDay) {
                                setSelectedDay(d.day);
                                setAddInto(d.day);
                            }
                            else {
                                setIsAddVillageClicked(true); setAddInto(d.day);
                            };
                        }}>
                        {d.day.charAt(0).toUpperCase() + d.day.slice(1)}
                    </button>
                )) : <Loader component="days" />}
            </div>

            {/* Village Links */}
            {selectedDayObj &&
                <div className='addContainer flex spaceBetween alignCenter'>
                    <div className='villagesContainer flex'>
                        {selectedDayObj.villages && selectedDayObj.villages.map((villageObj, index) => <NavLink key={index} to={selectedDay && `/${selectedDay}/${villageObj.villageName}`}
                            className={({ isActive }) => (isActive && village === villageObj.villageName ? 'active' : '')}
                        >{villageObj.villageName}</NavLink>)}
                    </div>
                    <div className='addButtonsContainer flex spaceEvenly'>
                        <button onClick={() => {
                            if (isAddPersonClicked) {
                                setIsAddPersonClicked(false);
                            }
                            setIsAddVillageClicked(true);
                        }}>
                            Add Village
                        </button>
                        <button onClick={() => {
                            if (isAddVillageClicked) {
                                setIsAddVillageClicked(false);
                            }
                            setIsAddPersonClicked(village && !isAddPersonClicked);
                        }}>
                            Add Person
                        </button>
                    </div>

                </div>
            }

            {/* Add village form */}
            {isAddVillageClicked && (
                <form className='addVillageForm flex flexColumn' onSubmit={handleAddVillageFunction}>
                    <h3>Add new Village into {addInto ? addInto.toUpperCase() : selectedDay?.toUpperCase()}</h3>
                    <input type='text' placeholder='Enter new village name' required onChange={(e) => setaddVillageFormName(e.target.value)} autoFocus />
                    <div className='addCancelButtonsContainer flex spaceEvenly'>
                        {isLoading ? <Loader component="addVillageAndPerson" /> : <>
                            <button type='submit'>Add</button>
                            <button type='button' onClick={() => { setIsAddVillageClicked(false); setAddInto(null) }}>Cancel</button>
                        </>}
                    </div>
                </form>
            )}

            {/* Add Person form */}
            {isAddPersonClicked && selectedDay && village && (
                <form className='addPersonForm flex flexColumn' onSubmit={handleAddPersonFunction}>
                    <h3>Add new Person into<br /> {day?.toUpperCase()} - {village?.toUpperCase()}</h3>
                    <input type='number' name='cardNo' placeholder='Card no' required onChange={handleChange} value={personFormData.cardNo} autoFocus />
                    <input type='text' name='personName' placeholder='Enter name' required onChange={handleChange} value={personFormData.personName} />
                    <input type='number' name='totalAmount' placeholder='Enter total amount' required onChange={handleChange} value={personFormData.totalAmount} />
                    <input type='text' name='villageName' placeholder='Enter village' onChange={handleChange} defaultValue={village} />
                    <input type='date' name='givenDate' required onChange={handleChange} value={personFormData.givenDate} />
                    <div className='addCancelButtonsContainer flex spaceEvenly'>
                        {
                            isLoading ? <Loader component="addVillageAndPerson" /> :
                                <>
                                    <button type='submit'>Add</button>
                                    <button type='button' onClick={() => setIsAddPersonClicked(false)}>Cancel</button>
                                </>
                        }
                    </div>
                </form>
            )}
        </nav>

        {/* new user welcome message */}
        {isNewUser && completeUserData.username && !selectedDay && <div className='flex alignCenter justifyCenter newUserContainer'>
            <div className='welcomeContainer flex flexColumn'>
                <p>Hello <span className='userName'>{completeUserData.username.toUpperCase()}</span>, welcome to <strong>FinBook</strong></p>
                <p>Manage all your finance logs at one place...</p>
                <p>Click on the any <span>Day</span> on the top to add a new <span>Village</span> in your account.</p>
            </div>
            <img src='/assets/images/welcome.jpg' className='welcomeImage' alt='welcomeImage' />
        </div>}

        {isNewUser && !selectedDay ? (<></>) : (
            <>{(!selectedDay || !village) && (
                <div className='flex justifyCenter alignCenter selectVillageAndPersonMessageContainer'>
                    {!selectedDayObj && (<p>Please <strong>select a day</strong> to <strong>add new Villages</strong> and get all the villages.</p>)}
                    {selectedDay && !village && (<p>Please <strong>select a village</strong> to <strong>add new Persons</strong> and get the details.
                        <br />
                        <br />
                        Click on <strong>Add Village</strong> button to add a new village in{' '}<strong>{selectedDay?.charAt(0).toUpperCase() + selectedDay?.slice(1)}</strong>.
                    </p>
                    )}
                    <div className='selectImageContainer'>
                        <img src='/assets/images/welcome.svg' className='selectImage' alt='welcomeImage' />
                    </div>
                </div>
            )}</>
        )}

    </>
    );
};
