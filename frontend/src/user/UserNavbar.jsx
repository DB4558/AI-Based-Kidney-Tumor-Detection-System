import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function UserNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = location.state;

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        if (response.ok) {
            localStorage.removeItem('token'); // Remove token from localStorage
            localStorage.removeItem('role'); // Remove role from localStorage
            localStorage.removeItem('userId'); // Remove userId from localStorage
            navigate('/'); // Redirect to login page
        } else {
            console.error('Logout failed');
        }
    };

    return (
        <nav style={styles.navbar}>
            <button style={styles.toggleButton} onClick={toggleSidebar}>
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} style={styles.icon} />
            </button>
            <ul style={{ ...styles.navList, ...(!isOpen && styles.navListClosed) }}>
                <li style={styles.sidenavItem}>
                    <Link style={styles.sideLink} to="/user/home" state={{ userId }}>Home</Link>
                </li>
                <li style={styles.sidenavItem}>
                    <Link to="/user/patient_home" state={{ userId }} style={styles.sideLink}>Register Case</Link>
                </li>
            </ul>
            <ul style={styles.navListTop}>
                <li style={styles.navItem}>
                    <Link style={styles.navLink} to="/user/home" state={{ userId }}>Home</Link>
                </li>
                <li style={styles.navItem}>
                    <button onClick={handleLogout} style={{ ...styles.navLink, ...styles.navButton }}>Logout</button>
                </li>
            </ul>
        </nav>
    );
}

export default UserNavbar;

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
    navList: {
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: '3px',
        paddingTop: '10px',
        transition: 'transform 0.3s ease-in-out',
        position: 'fixed',
        top: '60px',
        left: '0',
        width: '200px',
        height: '100%',
        backgroundColor: 'white',
        marginRight:'20px',
        
    },
    navListClosed: {
        transform: 'translateX(-100%)',
    },
    navItem: {
        margin: '5px 0',
    },
    sidenavItem: {
        marginTop:'30px',
        margin: '5px 0',
        fontSize: '1.2rem',
        transition: 'background-color 0.3s, color 0.3s',
        cursor: 'pointer',
         ':hover': {
            backgroundColor: '#007bff',
            color: 'white'
          }
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
    sideLink: {
        color: '#333',
        textDecoration: 'none',
        fontSize: '1.2rem',
        transition: 'background-color 0.3s, color 0.3s',
        width: '100%',
        paddingLeft: '20px',
        fontWeight: 'bold',
        fontSize: '1.3rem',
        paddingTop:'10px',
        marginTop:'10px',
    },
    toggleButton: {
        backgroundColor: 'white',
        color: 'black',
        border: 'none',
        borderRadius: '5px',
        padding: '10px',
        cursor: 'pointer',
    },
    icon: {
        backgroundColor: 'white',
        color: 'black',
        padding: '5px',
        borderRadius: '50%',
    },
};

