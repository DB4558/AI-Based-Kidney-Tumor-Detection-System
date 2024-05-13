
import React from 'react';

const Card = ({ children }) => {
    return (
        <div style={styles.card}>
            {children}
        </div>
    );
};

export default Card;

const styles = {
    card: {
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
        borderRadius: '5px',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#ffffff',
    },
};
