// DoctorRegistrationForm.js

import React, { useState } from 'react';


const DoctorRegistrationForm = () => {
    const [doctorData, setDoctorData] = useState({
        name: '',
        qualification: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctorData({ ...doctorData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send doctor registration data to backend
        fetch('http://localhost:5000/register-doctor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doctorData)
        })
        .then(response => {
            if (response.ok) {
                console.log('Doctor registered successfully');
                // Optionally, redirect to a different page or show a success message
            } else {
                console.error('Failed to register doctor');
                // Handle error case
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div className="registration-form-container">
            <div className="formBox">
                <h2 className="registration-title">Doctor Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="name" value={doctorData.name} onChange={handleChange} placeholder="Name" required />
                    </div>
                    <div className="form-group">
                        <input type="text" name="qualification" value={doctorData.qualification} onChange={handleChange} placeholder="Qualification" required />
                    </div>
                    <div className="form-group">
                        <input type="email" name="email" value={doctorData.email} onChange={handleChange} placeholder="Email" required />
                    </div>
                    <div className="form-group">
                        <input type="password" name="password" value={doctorData.password} onChange={handleChange} placeholder="Password" required />
                    </div>
                    <button type="submit" className="submit-button">Register</button>
                </form>
            </div>
        </div>
    );
};

export default DoctorRegistrationForm;
