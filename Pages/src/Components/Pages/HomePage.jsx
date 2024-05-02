import React, { useState } from 'react';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <>
        <div className="red-bar">
            <img src={iytelogo} alt="Logo" className="logo" />
        </div>
        <div className="wrapper">
            <h1>Welcome to the Home Page</h1>
            <p>This is your main area after login. Here you can access various features and information.</p>
            <div className="home-links">
                <p><Link to="/profile">My Profile</Link></p>
                <p><Link to="/settings">Settings</Link></p>
                <p><Link to="/logout">Logout</Link></p>
            </div>
        </div>
        </>
    );
}

export default HomePage;
