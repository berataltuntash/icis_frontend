import React from 'react';
import "./Pages.css"; 

const PopUp = ({ message, onClose }) => {
    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>{message}</h2>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default PopUp;
