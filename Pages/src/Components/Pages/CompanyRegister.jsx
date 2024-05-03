import React, { useState } from 'react';
import axios from 'axios';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import { Link } from 'react-router-dom';

const CompanyRegister = () => {

    const [companyname, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleRegister = async (event) => {
        event.preventDefault(); 

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/companyregister', {
                name: companyname,
                email,
                password
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);

        } catch (error) {
            console.error('Registration error:', error.response || error.message);

        }
    };

    return (
        <>
        <div className="red-bar">
            <img src={iytelogo} alt="Logo" className="logo" />
        </div>
        <div className="wrapper">
            <form onSubmit={handleRegister}>
                <h1>Company Register</h1>
                <div className="input-box">
                    <input type="companyname" placeholder="Company Name" required
                        value={companyname} onChange={e => setCompanyName(e.target.value)} />
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
                <div className="register-link">
                    <p>Are you a Iyte? <Link to="/IyteRegister">Register Here</Link></p>
                </div>
            </form>
        </div>
        </>
    );
}

export default CompanyRegister;
