import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import Cookies from 'js-cookie';
import axios from 'axios';
import Popup from '../PopUp';

const CreateInternshipAnnouncement = () => {
    const [name, setName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [announcement, setAnnouncement] = useState({
        companyname: '',
        offername: '',
        description: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('jwtToken');
        navigate('/login');
    };

    const handleClick = (path) => {
        navigate(path);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnnouncement(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = Cookies.get('jwtToken');
        try {
            const response = await axios.post('http://localhost:8080/api/createoffer', {
                companyname: announcement.companyname,
                offername: announcement.offername,
                description: announcement.description
            }, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 202) {
                setMessage(response.data);
            } else {
                setMessage(response.data);
            }
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 2000);
        } catch (error) {
            console.error('Error creating internship announcement:', error);
            setMessage('Error creating internship announcement.');
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 2000);
        }
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
                if (usertype === 'Company') {
                    console.log(`Welcome, ${name}`);
                } else if (usertype === 'Staff') {
                    navigate('/staffhomepage');
                } else if (usertype === 'Student') {
                    navigate('/studenthomepage');
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
                <div className="logo-container">
                    <img src={iytelogo} alt="Logo" className="logo" />
                </div>
                <div className="buttons-container2">
                    <button className="redbarbutton" onClick={() => handleClick("/createinternshipannouncement")}>Create Internship Announcement</button>
                    <button className="redbarbutton" onClick={() => handleClick("/fiiloutcompanyform")}>Fill Out Company Form</button>
                    <button className="redbarbutton" onClick={() => handleClick("/reviewsummerpracticereport")}>Review Summer Practice Report</button>
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
            <div className="form-container">
                <h2>Create Internship Announcement</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="companyname">Company Name:</label>
                        <input
                            type="text"
                            id="companyname"
                            name="companyname"
                            value={announcement.companyname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="offername">Offer Name:</label>
                        <input
                            type="text"
                            id="offername"
                            name="offername"
                            value={announcement.offername}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={announcement.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="submit-button">Create Announcement</button>
                </form>
            </div>
            {showPopup && (
                <Popup message={message} onClose={() => setShowPopup(false)} />
            )}
        </div>
    );
};

export default CreateInternshipAnnouncement;
