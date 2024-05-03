import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Popup from './PopUp.jsx';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/forgotpassword', { 
                email
            },{
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setMessage(response.data);
            setShowPopup(true);

            if (response.status === 202) {
                setTimeout(() => {
                    navigate('/resetpassword');
                    setShowPopup(false);
                }, 2000); 
            }else if (response.status === 400) {
                setTimeout(() => {
                    setShowPopup(false);
                }, 2000);
            }
        } catch (error) {
            setMessage(error.response?.data || 'Error sending email: The server may be down.');
            setShowPopup(true);
            if (error.response?.status === 400) {
                setTimeout(() => {
                    setShowPopup(false);
                }, 2000);
            }
        }
    };

    return (
        <>
            <div className="red-bar">
                <img src={iytelogo} alt="Logo" className="logo" />
            </div>
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Forgot Password</h1>
                    <div className="input-box">
                        <input type="email" placeholder="Email" required
                            value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <button className="button" type="submit">Submit</button>
                </form>
                {showPopup && (
                    <Popup message={message} onClose={() => setShowPopup(false)} />
                )}
            </div>
        </>
    );
}

export default ForgotPassword;
