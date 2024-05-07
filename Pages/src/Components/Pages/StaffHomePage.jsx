import React from 'react';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import appleBuilding from "../Assets/apple-building.jpg"; 
import { Link } from 'react-router-dom';

const StaffHomePage = () => {
    return (
        <div>
            <div className="red-bar">
                <div className="logo-container">
                    <img src={iytelogo} alt="Logo" className="logo" />
                </div>
                <div className="buttons-container3">
                    <button className="redbarbutton">
                        <Link to="/summerpracticereport" className="link-style">Summer Practice Report</Link>
                    </button>
                    <button className="redbarbutton">
                        <Link to="/manageinternshipopportunities" className="link-style">Manage Internship Opportunities</Link>
                    </button>
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

export default StaffHomePage;
