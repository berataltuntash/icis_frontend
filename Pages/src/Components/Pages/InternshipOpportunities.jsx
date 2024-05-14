import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import Cookies from 'js-cookie';
import axios from 'axios';

const InternshipOpportunities = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [name, setName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [opportunities, setOpportunities] = useState([]);
    const navigate = useNavigate();

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
                    } else if( usertype === 'Company') {
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

    useEffect(() => {
        const fetchOpportunities = async () => {
            if (!isAuthenticated) {
                return;
            }
            const token = Cookies.get('jwtToken');
            try {
                const response = await axios.get('http://localhost:8080/api/showalloffers', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setOpportunities(response.data);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
            }
        };

        fetchOpportunities();
    }, [isAuthenticated]);

    return (
        <div>
            <div className="red-bar">
                <div className="logo-container">
                    <img src={iytelogo} alt="Logo" className="logo" />
                </div>
                <div className="buttons-container">
                    <button className="redbarbutton" onClick={() => handleClick("/internshipopportunities")}>Internship Opportunities</button>
                    <button className="redbarbutton" onClick={() => handleClick("/myinternship")}>My Internship</button>
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
                <div className="opportunities-container">
                {opportunities.map((opportunity) => (
                    <div key={opportunity.offerid} className="offername-item">
                        <span className='companyname'>{opportunity.offername}</span>
                        <button className="view-button" onClick={() => handleClick(`/opportunitydetail/${opportunity.offerid}`)}>View</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InternshipOpportunities;
