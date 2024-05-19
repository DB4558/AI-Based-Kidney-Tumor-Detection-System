
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { email, password });
      //const { role, redirect_url, userId } = response.data; 
      const { token, role, userId } = response.data;
      console.log(response.data);
      // Store the token in local storage or session storage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      console.log(userId);
    
      if (role === 'user') {
        navigate('/user/patient_home', { state: { userId } }); 
      }
      else{
        navigate('/doctor/doctor_home', { state: { userId } }); 
      }
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '15px', width: '100%' }}>
          <label style={{ marginBottom: '5px' }}>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }} required />
        </div>
        <div style={{ marginBottom: '15px', width: '100%' }}>
          <label style={{ marginBottom: '5px' }}>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }} required />
        </div>
        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Login</button>
        {/* Add a Link for users to navigate to the registration page */}
        <p style={{ marginTop: '20px' }}>
          Are you a user? Not registered? <Link to="/user/registration" style={{ color: '#007bff', textDecoration: 'none' }}>Kindly register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;

