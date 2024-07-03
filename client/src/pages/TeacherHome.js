import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function TeacherHome() {
    const navigate = useNavigate();
    const [teacherData, setTeacherData] = useState(null);
    const { id: siteId } = useParams(); 
    

    useEffect(() => {
        axios.get("http://localhost:3001/teacher/auth", { withCredentials: true })
            .then((response) => {
                const { teacherId } = response.data;
                
                axios.get(`http://localhost:3001/teacher/${teacherId}`, { params: {siteId},withCredentials: true})
                    .then((teacherResponse) => {
                        setTeacherData(teacherResponse.data);
                    })
                    .catch((error) => {
                        console.error("Error fetching teacher data:", error);
                        navigate('/teacher/login');
                    });
            })
            .catch((error) => {
                console.error("Error checking authentication:", error);
                navigate('/teacher/login');
            });
    }, [navigate, siteId]);

    if (!teacherData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Welcome Teacher</h2>
            <p>{teacherData.message}</p>
            <></>
            <p><Link to="/createquiz">Create Quiz</Link></p>
        </div>
    );
}

export default TeacherHome;
