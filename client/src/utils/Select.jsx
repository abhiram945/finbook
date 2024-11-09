import React from 'react'
import "../styles/Select.css";

const AddVillage = ({ dayName }) => {
    return <div className='flex justifyCenter alignCenter addVillageContainer'>
        <p>click on <strong>Add Village</strong> button to add a new village in <strong>{dayName}</strong>.</p>
        <div className='selectImageContainer'>
            <img src='/assets/welcome.svg' alt='welcomeImage' />
        </div>
    </div>
}

const SelectVillage = () => {
    return <div className='flex justifyCenter alignCenter selectVillageContainer'>
        <p><strong>Select a village</strong> to <br/> <strong>Add new Persons</strong>.</p>
        <div className='selectImageContainer'>
            <img src='/assets/welcome.svg' alt='welcomeImage' />
        </div>
    </div>
}

const NoUsersFound = ({day, village}) => {
    return <div className="noUsersFoundContainer flex flexColumn alignCenter">
        <p><strong>No users found on {day.toUpperCase()} in {village.toUpperCase()}</strong></p>
        <p>Click on <strong>Add Person</strong> button on the top to add a new person in <strong>{village.toUpperCase()}</strong></p>
        <img src="/assets/noUsersFound.jpg" alt="noUsersFound" className="noUsersFoundImage" />
    </div>
}

export { AddVillage, SelectVillage, NoUsersFound };