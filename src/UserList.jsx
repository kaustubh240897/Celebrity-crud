import React, { useState } from 'react';
import data from './data.json';
import { useEffect } from 'react';

const UserList = () => {
    const [users, setUsers] = useState(data);
    const [editMode, setEditMode] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(data);

    const handleAccordionClick = (id) => {
        if (editMode !== null) {
            return; // If edit mode is active, do not open other accordions
        }
        if (id === editMode) return;
        setEditMode(null);
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id ? { ...user, open: !user.open } : { ...user, open: false }
            )
        );
    };
    const handleSearch = (e) => {
        console.log("kdsfkslfkl")
        let query = e.target.value;
        setSearchQuery(query);
        const filtered = data.filter(
            (user) =>
                user.first.toLowerCase().includes(query.toLowerCase()) ||
                user.last.toLowerCase().includes(query.toLowerCase()) ||
                user.gender.toLowerCase().includes(query.toLowerCase()) ||
                user.country.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
        setUsers(filtered)
    };

    const calculateAge = (dob) => {
        if (isNaN(dob)) {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }
        return dob;
    };

    const handleEditClick = (id) => {
        setEditMode(id);
    };

    const handleSaveClick = (id) => {
        // Implement your logic to save the edited user data here
        // Update the users state and reset the edit mode
        setEditMode(null);
    };

    const handleCancelClick = (id) => {
        // Reset the user data to its last known state before editing
        setEditMode(null);
    };

    const handleDeleteClick = (id) => {

        //setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        //setEditMode(null);
        setUserToDelete(id);
        //setShowConfirmationModal(true);
        const shouldDelete = window.confirm("Are you sure you want to delete this user?");
        if (shouldDelete) {
            // Implement your logic to delete the user here
            // Update the users state accordingly
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            setFilteredUsers((prevFiltered) => prevFiltered.filter((user) => user.id !== id));
        }
    };

    const handleChange = (e, id) => {
        const { name, value } = e.target;
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === id ? { ...user, [name]: value } : user))
        );
    };

    return (
        <div id="content">
            <div className="search-bar">
                <input
                    id="searchbar"
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>
            {users.map((user) => (
                <div key={user.id} className="user">
                    <div className={`accordion ${user.open ? 'open' : ''}`} onClick={() => handleAccordionClick(user.id)}>
                        <div className="left">
                            <img src={user.picture} alt={user.first} />
                        </div>
                        <div className="mid">
                            <h4>{user.first} {user.last}</h4>

                        </div>
                        <div className="right">
                            <span className="icon">{user.open ? "-" : "+"}</span>
                        </div>
                    </div>
                    {user.open && (
                        <div className="details">
                            <div className='child'>
                                <div>
                                    <label className="age">Age </label>
                                        <br />
                                        <input
                                            id="dob"
                                            type="number"
                                            name="dob"
                                            value={calculateAge(user.dob)}
                                            onChange={(e) => handleChange(e, user.id)}
                                            disabled={editMode !== user.id || calculateAge(user.dob) < 18}

                                        />
                                    
                                </div>
                                <div>
                                    <label>Gender</label>
                                    <br />
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={user.gender}
                                        onChange={(e) => handleChange(e, user.id)}
                                        disabled={editMode !== user.id || calculateAge(user.dob) < 18}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="transgender">Transgender</option>
                                        <option value="rather_not_say">Rather not say</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Country</label>
                                    <br />
                                    <input
                                        id="country"
                                        type="text"
                                        name="country"
                                        value={user.country}
                                        onChange={(e) => handleChange(e, user.id)}
                                        onKeyPress={(e) => {
                                            if (/\d/.test(e.key)) {
                                                e.preventDefault(); 
                                            }
                                        }}
                                        disabled={editMode !== user.id || calculateAge(user.dob) < 18}
                                    />
                                </div>
                            </div>
                            <br />
                            <div className='child2'>
                                <label>Description</label>
                                <br />
                                <textarea
                                    id="description"
                                    name="description"
                                    value={user.description}
                                    onChange={(e) => handleChange(e, user.id)}
                                    disabled={editMode !== user.id || calculateAge(user.dob) < 18}
                                />
                            </div>
                            {editMode === user.id && (
                                <div className='save-cancel'>
                                    <button onClick={() => handleSaveClick(user.id)}>Save</button>
                                    <button onClick={() => handleCancelClick(user.id)}>Cancel</button>
                                </div>
                            )}
                            {!editMode && calculateAge(user.dob) >= 18 && (
                                <div className='edit-delete'>
                                    <button onClick={() => handleEditClick(user.id)}>Edit</button>
                                    <button onClick={() => handleDeleteClick(user.id)}>Delete</button>
                                </div>
                            )}


                        </div>
                    )}
                </div>
            ))}

            


        </div>
    );
};

export default UserList;
