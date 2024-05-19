// UserRegistrationForm.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './UserRegistrationForm.css'; // Import CSS file

const UserRegistrationForm = () => {
    const [userData, setUserData] = useState({
        name: '',
        age: '',
        sex: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send user registration data to backend
        fetch('/register-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (response.ok) {
                console.log('User registered successfully');
                setUserData({
                    name: '',
                    age: '',
                    sex: '',
                    email: '',
                    password: ''
                });
                // Redirect to login page
                navigate('/'); 
                
            } else {
                console.error('Failed to register user');
                
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div className="registration-form-container">
            <div className="formBox">
                <h2 className="registration-title">User Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="name" value={userData.name} onChange={handleChange} placeholder="Name" required />
                    </div>
                    <div className="form-group">
                        <input type="number" name="age" value={userData.age} onChange={handleChange} placeholder="Age" />
                    </div>
                    <div className="form-group">
                        <select name="sex" value={userData.sex} onChange={handleChange} required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" required />
                    </div>
                    <div className="form-group">
                        <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" required />
                    </div>
                    <button type="submit" className="submit-button">Register</button>
                </form>
            </div>
        </div>
    );
};

export default UserRegistrationForm;
