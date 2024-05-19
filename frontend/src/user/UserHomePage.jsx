import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../Card'; // Import the Card component
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

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
    const [prediction, setPrediction] = useState('');
    const navigate = useNavigate();

    const location = useLocation();
    const { userId } = location.state;
    const token = localStorage.getItem('token'); 

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
            await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${token}`
                }
            });
            setMessage('Image uploaded successfully');
        } catch (error) {
            setMessage('Failed to upload image');
        }
    };

    const handlePredict = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage('Please upload an image first');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result.split(',')[1]; // Get base64 part of the result

               // const response = await axios.post('http://localhost:5000/predict', { image: base64Image });
               const response = await axios.post('/predict', { image: base64Image }, {
                headers: {
                    'Authorization': `${token}`  // Include the token in the Authorization header
                }
            });
                const predictionResult = response.data[0]?.image || 'Unknown';

                setPrediction(predictionResult);
                setMessage('Prediction successful');

            //     await axios.post(`http://localhost:5000/save_model_prediction/${userId}`, { 
            //     prediction: predictionResult 
            // });
            await axios.post(`/save_model_prediction/${userId}`, {
                prediction: predictionResult 
            }, {
                headers: {
                    'Authorization': `${token}`  // Include the token in the Authorization header
                }
            });
            };
            reader.readAsDataURL(file); // Read the file as a base64 string
        } catch (error) {
            setMessage('Failed to get prediction');
        }
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
               // const response = await axios.get(`http://localhost:5000/user/${userId}`);
               console.log(token);
               const response = await axios.get(`/user/${userId}`, {
                headers: {
                    'Authorization': `${token}`  // Include the token in the Authorization header
                }
            });
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

    const handleLogout = async () => {
        try {
            await axios.post('/logout', {token}
              );
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
    
            
            navigate('/');  
        } catch (error) {
            console.error('Logout failed:', error);
            setMessage('Logout failed. Please try again.');
        }
    };

    return (
        <div>
            <div style={styles.Detailscontainer}>
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
                    <button onClick={handlePredict} style={styles.button} disabled={!file}>Predict</button>
                    {message && <p style={styles.message}>{message}</p>}
                    </Card>
                </div>
            {prediction && (
                <div style={styles.PredictionContainer}>
                    <h2 style={styles.heading}>Prediction Result</h2>
                    <Card>
                        <p style={styles.predictionText}>{prediction}</p>
                    </Card>
                </div>
            )}
            <div>
             <button onClick={() => navigate('/user/doctor-suggestions', { state: { userId } })} style={styles.button}>
                    View Doctor Suggestions
            </button>
            </div>
        <div>
        <button onClick={handleLogout} style={styles.button}>
            Logout
        </button>
        </div>

              
        </div>
    );
}

export default UserHomePage;

const styles = {
    Detailscontainer: {
        margin: '10%',
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
    UploadContatiner: {
        margin: '10%',
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
        width: '30%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        marginTop: '1%',
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
  
};
