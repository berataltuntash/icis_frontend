import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Popup from './PopUp.jsx';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState(''); 
    const [code, setCode] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async (event) => {
        event.preventDefault(); 

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/resetpassword', {
                email,
                password : newPassword, 
                emailCode : code
            });
            if (response.status === 202) {
                setMessage(response.data || "Password reset successful.");
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    navigate('/login');
                }, 2000);
            } else if (response.status === 400) {
                setMessage(response.data || "Password reset error: The server may be down.");
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 2000);
            } else {
                setMessage(response.data || "Unexpected status received. Please try again.");
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 2000);
            }
           
        } catch (error) {
            setMessage(error.response?.data || 'Error sending email: The server may be down.');
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);

        }
    };

    return (
        <>
        <div className="red-bar">
            <div className="logo-container">
                <img src={iytelogo} alt="Logo" className="logo" />
            </div>
        </div>
        <div className="wrapper">
            <form onSubmit={handleResetPassword}>
                <h1>Reset Password</h1>
                <div className="input-box">
                    <input type="email" placeholder="Email" required
                        value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="New Password" required
                        value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Confirm Password" required
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="code" placeholder="Email Code" required
                        value={code} onChange={e => setCode(e.target.value)} />
                </div>
                <button className="button" type="submit">Reset</button>
            </form>
            {showPopup && (
                    <Popup message={message} onClose={() => setShowPopup(false)} />
                )}
        </div>
        </>
    );
}

export default ResetPassword;
