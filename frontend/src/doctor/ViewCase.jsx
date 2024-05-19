import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Card from '../Card';

function ViewCase() {
    const [caseData, setCaseData] = useState(null);
    const [error, setError] = useState(null);
    const { caseId } = useParams();
    const [imageSrc, setImageSrc] = useState(null);
    const [reload, setReload] = useState(false);

    const [doctorPrediction, setDoctorPrediction] = useState('');
    const token = localStorage.getItem('token'); 
    const handleSaveDoctorPrediction = async () => {
        try {
            // Send a POST request to the backend with the new doctor prediction
            await axios.post(`/save_doctor_prediction/${caseId}`, { doctorPrediction }, { headers: {
                'Authorization': `${token}`
            }});
            
            // Reset the doctorPrediction state variable
            setDoctorPrediction('');
            setError(null);
            setReload(!reload);
             
            // Optionally, you can show a success message or perform any other action upon successful saving
            alert('Doctor prediction saved successfully');
        } catch (error) {
            setError('Failed to save doctor prediction');
        }
    };
    useEffect(() => {
        const fetchCaseData = async () => {
            try {
                const response = await axios.get(`/case/${caseId}`,{
                    headers: {
                        'Authorization': `${token}`  
                    }
                });
                setCaseData(response.data);
                console.log(response.data)
                const imageResponse = await axios.get(`/image/${caseId}`, {  headers: {
                    'Authorization': `${token}`  
                }, responseType: 'blob' }
        
            );
                const imageUrl = URL.createObjectURL(imageResponse.data);
                setImageSrc(imageUrl);

                setError(null);
            } catch (error) {
                setError('Failed to fetch case data');
            }
        };

        fetchCaseData();
    }, [caseId,reload]);

    return (
        <div>
            {error && <div>Error: {error}</div>}
            {caseData && (
                <div>
                    <h2>Case Details</h2>
                    <div style={styles.card}>
                    <Card >
                    <p><strong>Case ID:</strong> {caseData.id}</p>
                    <p><strong>User ID:</strong> {caseData.user_id}</p>
                    <p><strong>Prediction:</strong> {caseData.prediction ? caseData.prediction : 'N/A'}</p>
                    <p><strong>Doctor's Prediction:</strong> {caseData.doctor_prediction ? caseData.doctor_prediction : 'N/A'}</p>
                    <input
                                type="text"
                                value={doctorPrediction}
                                onChange={(e) => setDoctorPrediction(e.target.value)}
                                placeholder="Enter doctor's prediction"
                            />
                            <button style={styles.button} onClick={handleSaveDoctorPrediction}>Save Doctor Prediction</button>
                    </Card>
                    {imageSrc && <img src={imageSrc} alt="Case Image" />}
                        </div>

                   
                    
                </div>
            )}
        </div>
    );
}

export default ViewCase;
const styles = {
    card:{
        width:'50%',
        marginLeft:'25%'
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
}