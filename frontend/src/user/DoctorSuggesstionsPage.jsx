
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Card from '../Card';

function DoctorSuggestionsPage() {
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const location = useLocation();
    const token = localStorage.getItem('token');
    const { userId } = location.state;

    useEffect(() => {
        const fetchDoctorSuggestions = async () => {
            try {
                const response = await axios.get(`/get-doctor-suggestions/${userId}`, {
                    headers: {
                        'Authorization': `${token}`  // Correctly formatted Authorization header
                    }
                });
                setSuggestions(response.data);  // Assuming the response data is the list of suggestions
            } catch (err) {
                console.error('Error fetching doctor suggestions:', err);
                setError('Failed to fetch doctor suggestions');
            }
        };

        if (token && userId) {  // Ensure token and userId are available
            fetchDoctorSuggestions();
        }
    }, [userId, token]); 

  
    return (
        <div>
            <h2>Doctor Suggestions</h2>
            {suggestions.length > 0 ? (
                suggestions.map(suggestion => (
                    <Card key={suggestion.id}>
                        <p><strong>Prediction:</strong> {suggestion.prediction}</p>
                        <p><strong>Doctor's Prediction:</strong> {suggestion.doctor_prediction}</p>
                        {suggestion.image && (
                            <img src={`data:image/jpeg;base64,${suggestion.image}`} alt="Prediction Visual" style={{ maxWidth: '100%' }} />
                        )}
                    </Card>
                ))
            ) : (
                <p>No suggestions available.</p>
            )}
            {error && <p>Error: {error}</p>}
        </div>
    );
}

export default DoctorSuggestionsPage;

