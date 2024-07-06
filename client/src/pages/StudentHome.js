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

    const QuizCard = ({ quiz }) => {
      const handleCardClick = () => {
          navigate(`/quiz/${quiz.id}`);
      };
      return (
          <div className="quiz-card" onClick={handleCardClick}>
              <h2>{quiz.title}</h2>
              <p>Subject ID: {quiz.subjectId}</p>
              <p>Teacher ID: {quiz.teacherId}</p>
          </div>
      );
  };

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
      <h1>Welcome, Student</h1>

      <div className="quizzes-container">
        {studentData.quizzes && studentData.quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>

    </div>
  )
}

export default StudentHome