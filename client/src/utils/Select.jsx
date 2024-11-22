import React from 'react'
import "../styles/Select.css";

const AddVillage = ({ dayName }) => {
    return <div className='flex justifyCenter alignCenter addVillageContainer'>
        <p>Add a new village in <strong>{dayName}</strong>.</p>
        <div className='selectImageContainer'>
            <img src='/assets/welcome.svg' alt='welcomeImage' />
        </div>
    </div>
}

const SelectVillage = () => {
    return <div className='flex alignCenter selectVillageContainer'>
        <p><strong>Select a village</strong> to <br/> <strong>Add new Persons</strong>.</p>
        <div className='selectImageContainer'>
            <img src='/assets/welcome.svg' alt='welcomeImage' />
        </div>
    </div>
}

const NoUsersFound = ({day, village}) => {
    return <div className="noUsersFoundContainer flex flexColumn alignCenter">
        <p><strong>No users found on {day.toUpperCase()} in {village.toUpperCase()}</strong></p>
        <p>Add a new Person in <strong>{village.toUpperCase()}</strong></p>
        <img src="/assets/noUsersFound.jpg" alt="noUsersFound" className="noUsersFoundImage" />
    </div>
}

export { AddVillage, SelectVillage, NoUsersFound };