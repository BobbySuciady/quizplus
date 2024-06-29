import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function StudentHome() {
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3001/student/auth",{ withCredentials: true }).then((response) => {
            if (!response.data.username) {
                navigate('/login');
            } 
        })
    }, []);

  return (
    <div>Student</div>
  )
}

export default StudentHome