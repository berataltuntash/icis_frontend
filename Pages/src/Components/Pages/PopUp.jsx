import React from 'react';
import "./Pages.css"; 

const PopUp = ({ message, onClose }) => {
    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>{message}</h2>
            </div>
        </div>
    );
};

export default PopUp;
