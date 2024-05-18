import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import Cookies from "js-cookie";
import axios from "axios";
import Popup from "../PopUp";

const ManageCompanies = () => {
    const [name, setName] = useState("");
    const [companies, setCompanies] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
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
    
        try {
            const response = await axios.post(`http://localhost:8080/api/managecompanyapplication/${companyId}`, {
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
                    fetchCompanies(); // Refetch the companies after an action is successfully completed
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
    };
    

    const fetchCompanies = async () => {
        const token = Cookies.get("jwtToken");
        try {
            const response = await axios.get("http://localhost:8080/api/managecompanyapplication", {
                headers: { "Authorization": `${token}` }
            });
            setCompanies(response.data);
        } catch (error) {
            console.error("Error fetching companies:", error);
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
            fetchCompanies();
        }
    };

    useEffect(() => {
        authenticateAndFetch();
    }, [navigate]);

    return (
        <div>
            <div className="red-bar">
                <div className="logo-container" onClick={() => handleClick("/studenthomepage")}>
                    <img src={iytelogo} alt="Logo" className="logo" />
                </div>
                <div className="buttons-container">
                    <button className="redbarbutton" onClick={() => handleClick("/summerpracticereport")}>Summer Practice Report</button>
                    <button className="redbarbutton" onClick={() => handleClick("/manageinternshipopportunities")}>Manage Internship Opportunities</button>
                    <button className="redbarbutton" onClick={() => handleClick("/managecompanies")}>Manage Companies</button>
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
                {companies.map((company) => (
                    <div key={company.companyId} className="offername-item">
                        <span className='companyname'>{company.companyName}</span>
                        <div className='approve-reject-buttons'>
                            <button className="approve-button-company" onClick={() => handleApproveReject(company.companyId, true)}>Approve</button>
                            <button className="reject-button-company" onClick={() => handleApproveReject(company.companyId, false)}>Reject</button>
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

export default ManageCompanies;
