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
    const [students, setStudents] = useState([]);
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

    const handleApproveReject = async (studentId, isApprove) => {
        const token = Cookies.get("jwtToken");
        setIsSubmitting(true);
    
        try {
            const response = await axios.post(`http://localhost:8080/api/applicationstocompany/${studentId}`, {
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
                    fetchstudents();
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
            const response = await axios.get("http://localhost:8080/api/applicationstocompany", {
                headers: { "Authorization": `${token}` }
            });
            setStudents(response.data);
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
            <div className="red-bar-company">
                <div className="logo-container-company" onClick={() => handleClick("/staffhomepage")}>
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
            <div className="applications-container-company">
                {students.map((student) => (
                    <div key={student.studentId} className="applications-item-company">
                        <span className='studentname-company'>{student.studentName}</span>
                        <div className='approve-reject-buttons-company'>
                            <button className="approve-button-company" onClick={() => handleApproveReject(student.studentId, true)} disabled={isSubmitting}>Approve</button>
                            <button className="reject-button-company" onClick={() => handleApproveReject(student.studentId, false)} disabled={isSubmitting}>Reject</button>
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
