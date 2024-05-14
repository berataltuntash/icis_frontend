// src/components/CompanyHomePage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import appleBuilding from "../Assets/apple-building.jpg";
import Cookies from 'js-cookie';

const CompanyHomePage = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const [name, setName] = useState('');

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
                    if( usertype === 'Company') {
                        console.log(`Welcome, ${name}`);
                    } else if( usertype === 'Staff') {
                        navigate('/staffhomepage');
                    } else if( usertype === 'Student') {
                        navigate('/studenthomepage');
                    }
                    setIsAuthenticated(true);
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                navigate('/login');
            }
        };

        if (Cookies.get('jwtToken')) {
            checkAuthentication();
        } else {
            navigate('/login');
        }
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
                <div className="buttons-container2">
                    <button className="redbarbutton">
                        <Link to="/createinternshipannouncement" className="link-style">Create Internship Announcement</Link>
                    </button>
                    <button className="redbarbutton">
                        <Link to="/fiiloutcompanyform" className="link-style">Fill Out Company Form</Link>
                    </button>
                    <button className="redbarbutton">
                        <Link to="/reviewsummerpracticereport" className="link-style">Review Summer Practice Report</Link>
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

export default CompanyHomePage;
