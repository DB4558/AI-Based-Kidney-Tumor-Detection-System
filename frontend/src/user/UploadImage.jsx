import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../Card'; // Import the Card component
import { useLocation } from 'react-router-dom';

const UserHome = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [email, setEmail] = useState('');
    const [userDetails, setUserDetails] = useState();
    const [error, setError] = useState(null);

    const location = useLocation();
    const { userId } = location.state; 

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', userId);

        try {
            await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Image uploaded successfully');
        } catch (error) {
            setMessage('Failed to upload image');
        }
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/${userId}`);
                setUserDetails(response.data); 
                setName(response.data.name);
                setAge(response.data.age);
                setSex(response.data.sex);
                setEmail(response.data.email);
                setError(null);
            } catch (error) { 
                setError('User not found');
                setUserDetails(null);
            }
        };

        fetchUserDetails();
    }, [userId]);

    return (
      <div></div>
    );
};

export default UserHome;

const styles = {
    container: {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        textAlign: 'center',
    },
    heading: {
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: '15px',
        width: '100%',
        textAlign: 'left',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '8px',
        borderRadius: '3px',
        border: '1px solid #ccc',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
    },
    message: {
        color: 'green',
        marginTop: '15px',
    },
};
