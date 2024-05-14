// src/components/StudentHomePage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import appleBuilding from "../Assets/apple-building.jpg";
import Cookies from 'js-cookie';
import axios from 'axios';

const StudentHomePage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [name, setName] = useState('');
    const [showLogout, setShowLogout] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('jwtToken');
        navigate('/login');
    };

    const formatName = (name) => {
        return name
            .split('.') 
            .map(part => part.charAt(0).toUpperCase() + part.slice(1)) 
            .join(' '); 
    };

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = Cookies.get('jwtToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.post('http://localhost:8080/api/checktoken', {}, {
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const { usertype, name } = response.data;

                if (response.status === 202) {
                    setName(formatName(name));
                    if ( usertype === 'Student')  {
                        console.log(`Welcome, ${name}`);
                    } else if( usertype === 'Staff') {
                        navigate('/staffhomepage');
                    }else if( usertype === 'Company') {
                        navigate('/companyhomepage');
                    }    
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                navigate('/login'); 
            }
        };

        checkAuthentication();
    }, [navigate]);

    if (!isAuthenticated) {
        return null; 
    }

    return (
        <div>
            <div className="red-bar">
                <div className="logo-container">
                    <img src={iytelogo} alt="Logo" className="logo" />
                </div>
                <div className="buttons-container">
                    <button className="redbarbutton">
                        <Link to="/internshipopportunities" className="link-style">Internship Opportunities</Link>
                    </button>
                    <button className="redbarbutton">
                        <Link to="/myinternship" className="link-style">My Internship</Link>
                    </button>
                </div>
                <div className="profile">
                    <h1 onClick={() => setShowLogout(!showLogout)}>{name}</h1>
                    {showLogout && (
                    <div className="dropdown-content">
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                    )}
                </div>
            </div>
            <div className="main-content">
                <div className="image-container">
                    <img src={appleBuilding} alt="Apple Building" className="main-image" />
                </div>
                <div className="announcements-container">
                    <h2 className="announcements-title">ANNOUNCEMENTS</h2>
                    <ul className="announcements-list">
                        <li className="announcement-item">First announcement goes here...</li>
                        <li className="announcement-item">Second announcement goes here...</li>
                        <li className="announcement-item">Third announcement goes here...</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default StudentHomePage;
