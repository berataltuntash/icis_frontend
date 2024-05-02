import React, { useState } from 'react';
import axios from 'axios';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  // Initialize useNavigate

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/login', {
                email: username,  // Assuming username is actually the email
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Login successful:', response.data);  // Optional: log the response data
            navigate('/homepage');  // Redirect to homepage on successful login
        } catch (error) {
            console.error('Login error:', error.response || error.message);
        }
    };

    return (
        <>
        <div className="red-bar">
            <img src={iytelogo} alt="Logo" className="logo" />
        </div>
        <div className="wrapper">
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" placeholder="Username" required
                        value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" required
                        value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="remember-forgot">
                    <label><input type="checkbox" /> Remember me</label>
                    <p><Link to="/forgotpassword">Forgot Password</Link></p>
                </div>
                <button className="button" type="submit">Login</button>
                <div className="register-link">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>
            </form>
        </div>
        </>
    );
}

export default LoginPage;
