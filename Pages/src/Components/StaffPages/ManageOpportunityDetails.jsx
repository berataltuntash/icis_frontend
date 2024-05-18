import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import Cookies from "js-cookie";
import axios from "axios";
import Popup from "../PopUp";

const ManageOpportunityDetails = () => {
    const { offerid } = useParams();
    const [name, setName] = useState("");
    const [details, setDetails] = useState({});
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

    const handleApproveReject = async (isApprove) => {
        const token = Cookies.get("jwtToken");
        const url = `http://localhost:8080/api/approverejectoffer/${offerid}`;
        const data = { approve: isApprove }; // Payload containing the boolean

        try {
            const response = await axios.post(url, data, {
                headers: {
                    "Authorization": `Bearer ${token}`
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
        const token = Cookies.get("jwtToken");

        try {
            const response = await axios.get(`http://localhost:8080/api/manageoffers/${offerid}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setDetails(response.data);
        } catch (error) {
            console.error("Error fetching opportunity details:", error);
        }
    };

    useEffect(() => {
        const authenticateAndFetch = async () => {
            const isAuthenticated = await checkAuthentication();
            if (isAuthenticated) {
                fetchOpportunityDetails();
            }
        };

        authenticateAndFetch();
    }, [navigate, offerid]);

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
                <div className="profile" onClick={() => handleLogout()}>
                    <h1>{name}</h1>
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
                                <button className="approve-button" onClick={() => handleApproveReject(true)}>Approve</button>
                                <button className="reject-button" onClick={() => handleApproveReject(false)}>Reject</button>
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
