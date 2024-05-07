import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import appleBuilding from "../Assets/apple-building.jpg";
import { Link } from 'react-router-dom';


const api = axios.create({
    baseURL: 'http://localhost:8080/', // Change this to your actual backend server URL
    withCredentials: true, // This is important for CORS and sessions/cookies handling
});

const StudentHomePage = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.post('/showstudenthomepage')
            .then(response => {
                // Response with user data means successful authentication
                setStudentInfo(response.data);
            })
            .catch(error => {
                console.error('Error fetching student home page:', error);
                if (error.response && error.response.status === 401) {
                    // If unauthorized, redirect to login page
                    navigate('/login');
                } else {
                    // Handle other types of errors (network error, server error, etc.)
                    alert('Error fetching data. Please try again later.');
                }
            });
    }, [navigate]);

    if (!studentInfo) {
        return <div>Loading...</div>;
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
                    <h1>Profile: {studentInfo}</h1>
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
