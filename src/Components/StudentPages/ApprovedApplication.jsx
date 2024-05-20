import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import iytelogo from "../Assets/iytelogo.png";
import Cookies from "js-cookie";
import axios from "axios";
import Popup from "../PopUp";
import './Company.css';
import '../PopUp.css';

const ApprovedInternship = () => {
    const [name, setName] = useState("");
    const [companies, setCompanies] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        Cookies.remove("jwtToken");
        navigate("/login");
    };

    const formatName = (name) => {
        return name
            .split('.') 
            .map(part => part.charAt(0).toUpperCase() + part.slice(1)) 
            .join(' '); 
    };

    const handleApproveReject = async (companyId, isApprove) => {
        const token = Cookies.get("jwtToken");
        setIsSubmitting(true);
    
        try {
            const response = await axios.post(`http://localhost:8080/api/applicationstostudent/${companyId}`, {
                approve: isApprove
            }, {
                headers: {
                    "Authorization": `${token}`,
                    "Content-Type": "application/json"
                }
            });
    
            if (response.status === 202) {
                setMessage(isApprove ? "Company approved successfully!" : "Company rejected successfully!");
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    fetchstudents(); // Refetch the students after an action is successfully completed
                }, 2000);
            } else {
                setMessage(`Failed to ${isApprove ? 'approve' : 'reject'} company.`);
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 2000);
            }
        } catch (error) {
            console.error(`Error ${isApprove ? 'approving' : 'rejecting'} company:`, error);
            setMessage(`Error ${isApprove ? 'approving' : 'rejecting'} company: ` + error.message);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
        }
        setIsSubmitting(false);
    };
    

    const fetchstudents = async () => {
        const token = Cookies.get("jwtToken");
        try {
            const response = await axios.get("http://localhost:8080/api/applicationstostudent", {
                headers: { "Authorization": `${token}` }
            });
            setCompanies(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
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
                if ( usertype === 'Staff')  {
                    console.log(`Welcome, ${name}`);
                } else if ( usertype === 'Student') {
                    navigate('/studenthomepage');
                } else if ( usertype === 'Company') {
                    navigate('/companyhomepage');
                }
                return true;
            }
        } catch (error) {
            console.error("Authentication check failed:", error);
            navigate("/login");
        }
        return false;
    };

    const authenticateAndFetch = async () => {
        const isAuthenticated = await checkAuthentication();
        if (isAuthenticated) {
            fetchstudents();
        }
    };

    useEffect(() => {
        authenticateAndFetch();
    }, [navigate]);

    return (
        <div>
            <div className="red-bar-student">
                <div className="logo-container-student" onClick={() => handleClick("/staffhomepage")}>
                    <img src={iytelogo} alt="Logo" className="logo-student" />
                </div>
                <div className="buttons-container-student">
                <button className="redbarbutton-student" onClick={() => handleClick("/createinternshipannouncement")}>Create Internship Announcement</button>
                    <button className="redbarbutton-student" onClick={() => handleClick("/fiiloutcompanyform")}>Fill Out Company Form</button>
                    <button className="redbarbutton-student" onClick={() => handleClick("/reviewsummerpracticereport")}>Review Summer Practice Report</button>
                    <button className='redbarbutton-student' onClick={() => handleClick('/approvedinternship')}>Approved Internship</button>
                </div>
                <div className="profile-student" onClick={() => setShowDropdown(!showDropdown)}>
                    <h1>{name}</h1>
                    {showDropdown && (
                        <div className="dropdown-menu-student">
                            <button onClick={handleLogout} className="dropdown-item-student">Logout</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="applications-container-student">
                {companies.map((company) => (
                    <div key={company.applicationId} className="applications-item-student">
                        <span className='company-student'>{company.companyName}</span>
                        <span className='company-student'>{company.offerName}</span>
                        <div className='approve-reject-buttons-student'>
                            <button className="approve-button-student" onClick={() => handleApproveReject(company.applicationId, true)} disabled={isSubmitting}>Approve</button>
                            <button className="reject-button-student" onClick={() => handleApproveReject(company.applicationId, false)} disabled={isSubmitting}>Reject</button>
                        </div>
                    </div>
                ))}
            </div>
            {showPopup && (
                <Popup message={message} onClose={() => setShowPopup(false)} />
            )}
        </div>
    );
};

export default ApprovedInternship;
