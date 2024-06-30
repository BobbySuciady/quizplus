import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

function StudentHome() {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState("")
    const siteId = useParams(); //returns {id: }

    useEffect(() => {
      axios.get("http://localhost:3001/student/auth", { withCredentials: true })
          .then((response) => {
              const { studentId } = response.data;
              
              axios.get(`http://localhost:3001/student/${studentId}`, { params: {siteId: siteId}, withCredentials: true})
                  .then((studentResponse) => {
                      setStudentData(studentResponse.data);
                  })
                  .catch((error) => {
                      console.error("Error fetching student data:", error);
                      navigate('/login');
                  });
          })
          .catch((error) => {
              console.error("Error checking authentication:", error);
              navigate('/login');
          });
  }, [navigate]);

  return (
    <div>
      {studentData.message}
    </div>
  )
}

export default StudentHome