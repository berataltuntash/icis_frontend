import React, { useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import iytelogo from "../Assets/iytelogo.png";
import Cookies from 'js-cookie';
import axios from 'axios';
import Popup from '../PopUp';
import './Student.css';
import '../PopUp.css';

const OpportunityDetail = () => {
    const { offerid } = useParams();
    const [name, setName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [details, setDetails] = useState({});
    const [message, setMessage] = useState('');  
    const [showPopup, setShowPopup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        Cookies.remove('jwtToken');
        navigate('/login');
    };


    const handleApply = async () => {
        const token = Cookies.get('jwtToken');
        setIsSubmitting(true);
 
        try {
            const response = await axios.post(`http://localhost:8080/api/applyinternship/${offerid}`, {}, {
                headers: {
                    'Authorization': `${token}`
                }
            });
            
            if (response.status === 202) {
                setMessage("Applied successfully!"); 
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                }, 2000);
                
            } else {
                setMessage("Failed to apply to opportunity.");
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                }, 2000);
            }
        } catch (error) {
            console.error('Error applying to opportunity:', error);
            setMessage("Error applying to opportunity: " + error.message);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 2000);
        }
        setIsSubmitting(false);  
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
            return  false;
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
                return true;
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
            navigate('/login'); 
        }

        return false;
    };

    const fetchOpportunity = async () => {
        try {
            const token = Cookies.get('jwtToken');
            const response = await axios.get(`http://localhost:8080/api/showoffers/${offerid}`, {
                headers: { 'Authorization': ` ${token}` }
            });
            setDetails(response.data);
        } catch (error) {
            console.error('Error fetching opportunity details:', error);
        }
    };

    const authenticateAndFetch = async () => {
        const isAuthenticated = await checkAuthentication();
        if (isAuthenticated) {
            fetchOpportunity();
        }
    };

    useEffect(() => {
        authenticateAndFetch();
    }, [navigate, offerid]);

    return (
        <div>
            <div className="red-bar">
                <div className="logo-container" onClick={() => handleClick("/studenthomepage")}>
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
            <div className="opportunities">
                <div className="opportunities-details">
                    {details && (
                        <div className="opportunity">
                            <div className="opportunity-header">
                                <h2>{details.companyname}</h2>
                            </div>
                            <div className="opportunity-name">
                                <h3>{details.offername}</h3>
                            </div>
                            <div className="opportunity-description">
                                <p>{details.description}</p>
                            </div>
                            <div className="opportunity-buttons">
                                <button className="apply-button" onClick={handleApply} disabled={isSubmitting}>Apply</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showPopup && (
            <Popup message={message} onClose={() => setShowPopup(false)} />
            )}
        </div>
    );
}

export default OpportunityDetail;
