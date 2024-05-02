import React, { useState } from 'react';
import axios from 'axios';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    // State for storing input values
    const [studentNumber, setStudentNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Handle form submission
    const handleRegister = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Simple validation to check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/register', {
                studentNumber,
                email,
                password,
                confirmPassword
            });
            console.log(response.data);
            // Redirect or handle response further, e.g., show success message, login the user, etc.
        } catch (error) {
            console.error('Registration error:', error.response || error.message);
            // Handle errors such as user already exists, server errors, etc.
        }
    };

    return (
        <>
        <div className="red-bar">
            <img src={iytelogo} alt="Logo" className="logo" />
        </div>
        <div className="wrapper">
            <form onSubmit={handleRegister}>
                <h1>Register</h1>
                <div className="input-box">
                    <input type="text" placeholder="Student Number" required
                        value={studentNumber} onChange={e => setStudentNumber(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="email" placeholder="Email" required
                        value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" required
                        value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Confirm Password" required
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                <button className="button" type="submit">Register</button>
                <div className="register-link">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </form>
        </div>
        </>
    );
}

export default RegisterPage;
