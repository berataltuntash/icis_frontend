import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import iytelogo from "../Assets/iytelogo.png";
import Cookies from "js-cookie";
import axios from "axios";
import Popup from "../PopUp";
import './Staff.css';
import '../PopUp.css';

const ManageOpportunityDetails = () => {
    const { offerid } = useParams();
    const [name, setName] = useState("");
    const [details, setDetails] = useState({});
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        Cookies.remove("jwtToken");
        navigate("/login");
    };

    const handleApproveReject = async (isApprove) => {
        const token = Cookies.get("jwtToken");
        setIsSubmitting(true);

        try {
            const response = await axios.post(`http://localhost:8080/api/approverejectapplication/${applicationId}`,{ 
                offerApprove: isApprove
                },{
                headers: {
                    "Authorization": `${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 202) {
                setMessage(isApprove ? "Approved successfully!" : "Rejected successfully!");
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 2000);
            } else {
                setMessage(`Failed to ${isApprove ? 'approve' : 'reject'} opportunity.`);
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 2000);
            }
        } catch (error) {
            console.error(`Error ${isApprove ? 'approving' : 'rejecting'} opportunity:`, error);
            setMessage(`Error ${isApprove ? 'approving' : 'rejecting'} opportunity: ` + error.message);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
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
        const token = Cookies.get("jwtToken");
        if (!token) {
            navigate("/login");
            return false;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/checktoken", {}, {
                headers: {
                    "Authorization": `${token}`,
                    "Content-Type": "application/json"
                }
            });
            const { usertype, name } = response.data;

            if (response.status === 202) {
                setName(formatName(name));
                if (usertype === "Staff") {
                    console.log(`Welcome, ${name}`);
                } else if (usertype === "Student") { 
                    navigate("/studenthomepage");
                } else if (usertype === "Company") {
                    navigate("/companyhomepage");
                }
                return true;
            }
        } catch (error) {
            console.error("Authentication check failed:", error);
            navigate("/login");
        }
        return false;
    };

    const fetchOpportunityDetails = async () => {
        try {
            const token = Cookies.get("jwtToken");
            const response = await axios.get(`http://localhost:8080/api/applicationtocompany/${applicationId}`, {
                headers: { "Authorization": `${token}` }
            });
            setDetails(response.data);
        } catch (error) {
            console.error("Error fetching opportunity details:", error);
        }
    };

    const authenticateAndFetch = async () => {
        const isAuthenticated = await checkAuthentication();
        if (isAuthenticated) {
            fetchOpportunityDetails();
        }
    };

    useEffect(() => {
        authenticateAndFetch();
    }, [navigate, offerid]);

    return (
        <div>
            <div className="red-bar-company">
                <div className="logo-container-company" onClick={() => handleClick("/companyhomepage")}>
                    <img src={iytelogo} alt="Logo" className="logo-company" />
                </div>
                <div className="buttons-container-company">
                    <button className="redbarbutton-company" onClick={() => handleClick("/createinternshipannouncement")}>Create Internship Announcement</button>
                    <button className="redbarbutton-company" onClick={() => handleClick("/fiiloutcompanyform")}>Fill Out Company Form</button>
                    <button className="redbarbutton-company" onClick={() => handleClick("/reviewsummerpracticereport")}>Review Summer Practice Report</button>
                    <button className='redbarbutton-company' onClick={() => handleClick('/approvedinternship')}>Approved Internship</button>
                </div>
                <div className="profile-company" onClick={() => setShowDropdown(!showDropdown)}>
                    <h1>{name}</h1>
                    {showDropdown && (
                        <div className="dropdown-menu-company">
                            <button onClick={handleLogout} className="dropdown-item-company">Logout</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="opportunities-company">
                <div className="opportunities-details-company">
                    {details && (
                        <div className="opportunity-company">
                            <div className="opportunity-header-company">
                                <h2>{details.studentname}</h2>
                            </div>
                            <div className="opportunity-name-company">
                                <h3>{details.studentid}</h3>
                            </div>
                            <div className="opportunity-description-company">
                                <p>{details.student}</p>
                            </div>
                            <div className="opportunity-buttons-company">
                                <button className="approve-button-application-company" onClick={() => handleApproveReject(true)} disabled={isSubmitting}>Approve</button>
                                <button className="reject-button-application-company" onClick={() => handleApproveReject(false)} disabled={isSubmitting}>Reject</button>
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
};

export default ManageOpportunityDetails;
