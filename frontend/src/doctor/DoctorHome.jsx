import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../Card';
import { useNavigate } from 'react-router-dom'; 

function DoctorHome() {
    const [userNames, setUserNames] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate hook

    useEffect(() => {
        const fetchPredictionData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/prediction_data');
                setUserNames(response.data);
                setError(null);
            } catch (error) {
                setError('Failed to fetch prediction data');
            }
        };

        fetchPredictionData();
    }, []);

    const handleViewCase = (caseId) => {
        // Navigate to the next page with user ID as parameter
        navigate(`/view-case/${caseId}`);
    };

    return (
        <div style={styles.container}>
            <h2>Patient Data List</h2>
            {error && <div>Error: {error}</div>}
            <ul style={styles.cardList}>
                {userNames.map(item => (
                    <div key={item.id} style={styles.card}>
                        <Card>
                            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={styles.cardtext}>
                                    <p><strong>Case ID:</strong> {item.id}</p>
                                    <p><strong>User ID:</strong> {item.user_id}</p>
                                    <p><strong>Username:</strong> {item.username}</p>
                                </div>
                                {/* Button to view case */}
                                <button style={styles.button} onClick={() => handleViewCase(item.id)}>View Case</button>
                            </li>
                        </Card>
                    </div>
                ))}
            </ul>
        </div>
    );
}

const styles = {
    cardtext:{
        marginLeft:'100px',
        fontSize: '16px'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    cardList: {
        listStyle: 'none',
        padding: 0,
        margin:0,
        width: '50%',
    },
    card: {
        margin: '2%',
        width: '100%',
    },
    button: {
        width: '20%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        margin: '3%',
        fontSize: '1.6vh',
        fontWeight: 'bold'
    },
};

export default DoctorHome;
