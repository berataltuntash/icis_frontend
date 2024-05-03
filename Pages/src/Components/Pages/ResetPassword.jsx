import React, { useState } from 'react';
import axios from 'axios';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState(''); 
    const [code, setCode] = useState('');

    const handleResetPassword = async (event) => {
        event.preventDefault(); 

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/resetpassword', {
                email,
                newPassword, 
                confirmPassword,
                emailcode : code
            });
            console.log(response.data);
           
        } catch (error) {
            console.error('Error resetting password:', error.response || error.message);

        }
    };

    return (
        <>
        <div className="red-bar">
            <img src={iytelogo} alt="Logo" className="logo" />
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
        </div>
        </>
    );
}

export default ResetPassword;
