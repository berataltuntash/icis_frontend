// src/components/StudentHomePage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import isLoggedIn from '../JWT/jwtToken'; 
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import appleBuilding from "../Assets/apple-building.jpg";
import Cookies from 'js-cookie';

const StudentHomePage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = Cookies.get('jwtToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.post('http://localhost:8080/api/checktoken', {
                    jwttoken: token
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 202) {
                    setIsAuthenticated(true);
                } else {
                    navigate('/login'); 
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
                    <h1>Profile</h1>
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
