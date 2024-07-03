import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function TeacherLogin() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = () => {
        const data = { username: username, password: password };
        axios.post(`http://localhost:3001/teacher/login`, data, { withCredentials: true }) // Ensure cookies are sent with the request
            .then((response) => {
                if (response.data.error) {
                    alert(response.data.error);
                } else {
                    navigate(`/teacher/${response.data.id}`);
                }
            }).catch(error => {
                console.error("Login failed:", error);
                alert("Login failed. Please try again."); // Handle login failure
            });
    };

  return (
    <div className='loginContainer'>
        <label>Student Email</label>
        <input onChange={(event) => setUsername(event.target.value)} type='text' />
        <label>Password</label>
        <input onChange={(event) => setPassword(event.target.value)} type='password' />
        <button onClick={login}>Login</button>
    </div>
  )
}

export default TeacherLogin