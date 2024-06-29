import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function StudentSignup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const signup = () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const data = { username: username, password: password };
        axios.post(`http://localhost:3001/student/signup`, data, {withCredentials: true})
            .then((response) => {
                if (response.data.error) {
                    alert(response.data.error);
                } else {
                    navigate("/login");
                }
            }).catch(error => {
                console.error("Signup failed:", error);
                alert("Signup failed. Please try again.");
            });
    };

    return (
        <div className='signupContainer'>
            <label>Username:</label>
            <input onChange={(event) => setUsername(event.target.value)} type='text' />
            <label>Password:</label>
            <input onChange={(event) => setPassword(event.target.value)} type='password' />
            <label>Confirm Password:</label>
            <input onChange={(event) => setConfirmPassword(event.target.value)} type='password' />
            <button onClick={signup}>Signup</button>
        </div>
    )
}

export default StudentSignup;
