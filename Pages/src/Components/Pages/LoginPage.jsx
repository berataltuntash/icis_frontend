import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import appleBuilding from "../Assets/apple-building.jpg";
import { Link } from 'react-router-dom';

const api = axios.create({
    baseURL: 'http://localhost:8080/',
    withCredentials: true,
});

const StudentHomePage = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentHomePage = async () => {
            try {
                const response = await api.post('/showstudenthomepage');
                setStudentInfo(response.data);
            } catch (error) {
                console.error('Error fetching student home page:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                } else {
                    alert('Error fetching data. Please try again later.');
                }
            }
        };

        fetchStudentHomePage();
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
