import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';

function TeacherLogin() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = () => {
        const data = { username: username, password: password };
        axios.post(`http://localhost:3001/teacher/login`, data, { withCredentials: true }) // Ensure cookies are sent with the request
            .then((response) => {
                console.log(response.data)
                if (response.data.error) {
                    alert(response.data.error);
                } else {
                    console.log(response.data.id)
                    navigate(`/teacher/${response.data.id}`);
                    
                }
            }).catch(error => {
                console.error("Login failed:", error);
                alert("Login failed. Please try again."); 
            });
    };

  return (
    <div className="login-container">
        <div className="logo-container">
            <img src={logo} alt="Quizplus Logo" className="logo" />
        </div>
            <div className="form-group">
                <label>Teacher Email</label>
                <input onChange={(event) => setUsername(event.target.value)} type="text" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input onChange={(event) => setPassword(event.target.value)} type="password" />
            </div>
            <button className="login-button" onClick={login}>Login</button>
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  )
}

export default TeacherLogin