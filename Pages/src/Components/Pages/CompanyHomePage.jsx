import React from 'react';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import appleBuilding from "../Assets/apple-building.jpg"; // ensure you have this image in your assets folder
import { Link } from 'react-router-dom';

const CompanyHomePage = () => {
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
                        <Link to="/fiiloutcompanyform" className="link-style">Fiil Out Company Form</Link>
                    </button>
                    <button className="redbarbutton">
                        <Link to="/reviewsummerpracticereport" className="link-style">Review Summer Practice Report</Link>
                    </button>
                </div>
                <div className="profile" >
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

export default CompanyHomePage;
