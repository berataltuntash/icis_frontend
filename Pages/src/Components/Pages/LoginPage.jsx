import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Popup from './PopUp.jsx';
import "./Pages.css";
import iytelogo from "../Assets/iytelogo.png";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                if (jwtToken) {
                    const response = await axios.post('http://localhost:8080/api/checktoken', {
                        token: jwtToken
                    });
                    
                    if (response.status === 200) {
                        // Kullanıcı zaten giriş yapmış, uygun bir yönlendirme yap
                        const { userType } = response.data;
                        if (userType === 'student') {
                            navigate('/studenthomepage');
                        } else if (userType === 'staff') {
                            navigate('/staffhomepage');
                        } else if (userType === 'company') {
                            navigate('/companyhomepage');
                        }
                        return;
                    }
                }
                // Kullanıcı giriş yapmamış veya token geçerli değil, login sayfasında kal
            } catch (error) {
                console.error('Error while checking login status:', error);
            }
        };

        checkLoggedIn();
    }, [navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/login', {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.status === 202) {
                const { jwtToken, message } = response.data;
                localStorage.setItem('jwtToken', jwtToken); 
                setMessage(message);
                setShowPopup(true);

                setTimeout(() => {
                    setShowPopup(false);
                    if (email.endsWith('@std.iyte.edu.tr')) {
                        navigate('/studenthomepage');
                    } else if (email.endsWith('@iyte.edu.tr')) {
                        navigate('/staffhomepage');
                    } else {
                        navigate('/companyhomepage');
                    }
                }, 2000);
            } else {
                setMessage(message);    
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                }, 2000);
            }
        } catch (error) {
            setMessage(error.response?.data || 'Server error: Could not log in.');
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
        }
    };

    return (
        <>
            <div className="red-bar">
                <div className="logo-container">
                    <img src={iytelogo} alt="Logo" className="logo" />
                </div>
            </div>
            <div className="wrapper">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Email" required
                            value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" required
                            value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="remember-forgot">
                        <label><input type="checkbox" /> Remember me</label>
                        <Link to="/forgotpassword">Forgot Password?</Link>
                    </div>
                    <button className="button" type="submit">Login</button>
                    <div className="register-link">
                        <p>Don't have an account? <Link to="/iyteregister">Register here</Link></p>
                    </div>
                </form>
                {showPopup && (
                    <Popup message={message} onClose={() => setShowPopup(false)} />
                )}
            </div>
        </>
    );
}

export default LoginPage;
