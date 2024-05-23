import React from 'react';
import { useNavigate } from 'react-router-dom';

function DoctorNavbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        if (response.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('userId');
            navigate('/');
        } else {
            console.error('Logout failed');
        }
    };

    return (
        <nav style={styles.navbar}>
            <ul style={{ ...styles.navListTop, marginLeft: 'auto' }}>
                <li style={styles.navItem}>
                    <button onClick={handleLogout} style={{ ...styles.navLink, ...styles.navButton }}>Logout</button>
                </li>
            </ul>
        </nav>
    );
}

export default DoctorNavbar;


const styles = {
    navbar: {
        width: '100%',
        backgroundColor: 'white',
        padding: '10px 20px', // Adjust padding for top navbar
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Add shadow for better separation
        position: 'fixed',
        top: '0',
        zIndex: '1000',
        display: 'flex',
        justifyContent: 'space-between', // Align items to the left and right
        alignItems: 'center', // Align items vertically
    },
    navListTop: {
        listStyle: 'none',
        display: 'flex',
        marginRight: '20px',
        padding: '0',
    },
   
    navItem: {
        margin: '5px 0',
        marginRight:'10px',
        fontSize: '1rem',
        transition: 'background-color 0.3s, color 0.3s',
    },
   
    navButton: {
        fontWeight: 'bold',
        background: 'none',
        border: 'none',
        color: 'black',
        textDecoration: 'none',
        padding: '0',
        cursor: 'pointer',
    },
    navLink: {
        color: '#333',
        textDecoration: 'none',
        fontSize: '1rem',
        transition: 'background-color 0.3s, color 0.3s',
        marginRight: '20px', // Add margin between nav items
        fontWeight: 'bold',
    },
   
  
};

// Add hover effect to sidenavItem
styles.sidenavItem[':hover'] = {
    backgroundColor: '#007bff',
    color: 'white',
};
