import React, { useState } from 'react';
import axios from 'axios';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        try {
            const response = await axios.post('http://localhost:8080/forgot-password', {
                email // Send the email to the backend
            });
            console.log(response.data);
            // You might want to display a confirmation message or handle the response further
        } catch (error) {
            console.error('Error sending email:', error.response || error.message);
            // Handle errors, such as server not reachable, email not in database, etc.
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
        </div>
        </>
    );
}

export default ForgotPassword;
