import React from 'react';
import UserNavbar from './UserNavbar';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
function HomePage() {
    const location = useLocation();
    const { userId } = location.state;
    const token = localStorage.getItem('token'); 
    console.log(userId);
    return (
        <div>
            <UserNavbar />
            <div style={styles.container}>
            <div style={styles.overlay}>
                <h1 style={styles.welcome}>Welcome!!</h1>
                <h2 style={styles.welcome2}>Improving Healthcare Together.</h2>
                <p style={styles.welcome3}>Join us as we revolutionize medical services collaboratively. </p>
                <p style={styles.welcome3}>Our esteemed team of physicians delivers cutting-edge care,</p>
                <p style={styles.welcome3}> always with empathy at the core.</p>
                <p style={styles.welcome3}>Enjoy the convenience of instant diagnosis from the comfort of your home.</p>
                <Link to="/user/patient_home" state={{ userId }} style={styles.button}>Register Case</Link> {/* Corrected Link to navigate to UserHomePage */}
            </div>
        </div>
        </div>

     
    );
}

export default HomePage;

const styles = {
    container: {
        height: '100vh',

        backgroundColor: '#f8f9fa',
        backgroundImage: 'url("https://img.freepik.com/free-photo/expressive-young-woman-posing-studio_176474-66963.jpg?t=st=1716057287~exp=1716060887~hmac=9de93ff4afb4cf822407f19556b98d338a031cd75fa2ade6a6494ef18405615d&w=1380")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingTop: '60px', // To prevent content from being hidden behind the fixed navbar
    },
    overlay: {
        marginTop:'5vh',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'left', // Align text to the left
    },
    welcome: {
        fontSize: '4.5rem',
        marginBottom: '20px',
        marginLeft: '6.5vw', // Add left margin for better readability
    },
    welcome2: {
        fontSize: '2.3rem',
        marginBottom: '20px',
        marginLeft: '6.5vw', // Add left margin for better readability
    },
    welcome3: {
        fontSize: '1.3rem',
        marginBottom: '20px',
        marginLeft: '6.5vw', // Add left margin for better readability
    },
    button: {
        fontSize: '1.3rem',
        display: 'inline-block',
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '15px 30px',
        borderRadius: '5px',
        textDecoration: 'none', // Remove default link underline
        marginTop: '20px', // Add margin to separate from paragraphs
        textAlign: 'center', // Align text inside button to center
        alignSelf: 'center', // Center the button vertically within its container,
        marginLeft: '6.5vw'
    },
};
