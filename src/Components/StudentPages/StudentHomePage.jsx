import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iytelogo from "../Assets/iytelogo.png";
import appleBuilding from "../Assets/apple-building.jpg";
import Cookies from 'js-cookie';
import axios from 'axios';
import { saveAs } from 'file-saver';

const StudentHomePage = () => {
    const [name, setName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleDownloadInternshipFile = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/download-internship-file', {
                responseType: 'blob', // Important: This tells axios to download the data as a binary blob
            });
    
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'downloaded_file.txt'; // Default filename if none is specified by the server
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?(.+)"?/);
                if (match) filename = match[1];
            }
    
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            saveAs(blob, filename); // Initiates download on the client's browser
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download the file.');
        }
    };

    const handleLogout = () => {
        Cookies.remove('jwtToken');
        navigate('/login');
    };

    const handleClick = (path) => {
        navigate(path);
    };

    const formatName = (name) => {
        return name
            .split('.') 
            .map(part => part.charAt(0).toUpperCase() + part.slice(1)) 
            .join(' '); 
    };

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
                } else if( usertype === 'Company') {
                    navigate('/companyhomepage');
                }    
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
            navigate('/login'); 
        }
    };

    useEffect(() => {
        checkAuthentication();
    }, [navigate]);

    return (
        <div>
            <div className="red-bar">
                <div className="logo-container" onClick={() => handleClick("/studenthomepage")}>
                    <img src={iytelogo} alt="Logo" className="logo" />
                </div>
                <div className="buttons-container">
                    <button className="redbarbutton" onClick={() => handleClick("/internshipopportunities")}>Internship Opportunities</button>
                    <button className="redbarbutton" onClick={() => handleClick(handleDownloadInternshipFile)}>My Internship</button>
                </div>
                <div className="profile" onClick={() => setShowDropdown(!showDropdown)}>
                    <h1>{name}</h1>
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <button onClick={handleLogout} className="dropdown-item">Logout</button>
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
