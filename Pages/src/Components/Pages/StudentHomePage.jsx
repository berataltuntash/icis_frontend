import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";
import { Link } from 'react-router-dom';

const StudentHomePage = () => {
    return (
        <div className="red-bar">
            <div className="logo-container">
                <img src={iytelogo} alt="Logo" className="logo" />
            </div>
            <div className="buttons-container">
                <button className="redbarbutton">
                    <Link to="/internshipopportunities" className="link-style">Internship Opportunities</Link>
                </button>
                <button className="redbarbutton">
                    <Link to="/myinternship" className="link-style">My Internship</Link>
                </button>
            </div>
        </div>
    );
}

export default StudentHomePage;