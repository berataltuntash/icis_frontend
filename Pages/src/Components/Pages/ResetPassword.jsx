import React, { useState } from 'react';
import axios from 'axios';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Handle form submission
    const handleResetPassword = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/reset-password', {
                newPassword, // Assuming the backend expects a field named 'newPassword'
                confirmPassword // This is optional if your backend doesn't need to verify it again
            });
            console.log(response.data);
            // Handle the response further, e.g., show a success message or redirect
        } catch (error) {
            console.error('Error resetting password:', error.response || error.message);
            // Handle errors, such as server errors or failed validations
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
                    <input type="password" placeholder="New Password" required
                        value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Confirm Password" required
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                <button className="button" type="submit">Reset</button>
            </form>
        </div>
        </>
    );
}

export default ResetPassword;
