import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../Card'; // Import the Card component
import { useLocation } from 'react-router-dom';

function UserHomePage() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [email, setEmail] = useState('');
    const [userDetails, setUserDetails] = useState();
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const location = useLocation();
    const { userId } = location.state; 
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        const previewURL = URL.createObjectURL(selectedFile);
        setPreviewImage(previewURL);
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
    <div>
        <div style={styles.Detailscontainer} >
        <h2 style={styles.heading}>User Details</h2>
            <Card>
        
            <div style={styles.row}>
        <div style={styles.column}>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Age:</strong> {age}</p>
        </div>
        <div style={styles.column}>
            <p><strong>Sex:</strong> {sex}</p>
            <p><strong>Email:</strong> {email}</p>
        </div>
    </div>
            </Card>

        </div>
    
        <div style={styles.UploadContatiner}>
        <h2 style={styles.heading}>Upload Image</h2>
        <Card>
        <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputContainer}>
                    <label style={styles.label}>Choose Image:</label>
                    <input type="file" onChange={handleFileChange} style={styles.input} />
                    {file && (
                        <div style={styles.previewContainer}>
                            <img src={previewImage} alt="Preview" style={styles.previewImage} />
                            <p style={styles.previewName}>{file.name}</p>
                        </div>
                    )}
                </div>
                <button type="submit" style={styles.button} disabled={!file}>Upload</button>
            </form>
            {message && <p style={styles.message}>{message}</p>}
        </Card>
        </div>
   
    </div>
  );
}

export default UserHomePage;
const styles = {

    Detailscontainer:{
        margin:'10%',
    },
    heading: {
        marginBottom: '20px',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
        textAlign: 'left',
    },
    UploadContatiner:{
        margin:'10%',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
    },
    input: {
        width: '60%',
        padding: '8px',
        borderRadius: '3px',
        border: '1px solid #ccc',
    },
    button: {
        width: '10%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        marginTop:'1%'
    },
    message: {
        color: 'green',
        marginTop: '15px',
    },
    previewContainer: {
        marginTop: '10px',
        display: 'flex',
        alignItems: 'center',
    },
    previewImage: {
        width: '100px',
        height: 'auto',
        marginRight: '10px',
    },
    previewName: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginTop: '0',
    },
}