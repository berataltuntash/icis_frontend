import React, { useState } from 'react';
import axios from 'axios';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import { Link } from 'react-router-dom';

const LoginPage = () => {
    // State for storing input values
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Handle form submission
    const handleLogin = async (event) => {
        event.preventDefault();  // Prevent default form submission behavior
        try {
            const response = await axios.post('http://localhost:8080/login', {
                username,  // Shorthand for username: username
                password   // Shorthand for password: password
            });
            console.log(response.data);  // Handle the response as needed
            // Redirect or do other actions based on the response
        } catch (error) {
            console.error('Login error:', error.response || error.message);
            // Handle errors such as incorrect credentials, server errors, etc.
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
