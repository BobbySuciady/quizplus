import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function StudentHome() {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState({ quizzes: [] });
    const siteId = useParams(); //returns {id: }

    const QuizCard = ({ quiz }) => {
        const handleCardClick = () => {
            // if (!quiz.submitted) {
            //     navigate(`/quiz/${quiz.id}`);
            // }
            navigate(`/quiz/${quiz.id}`);
        };

        return (
            <div className={`quiz-card ${quiz.submitted ? 'locked' : ''}`} onClick={handleCardClick}>
                <h2>{quiz.title}</h2>
                <p>Subject ID: {quiz.subjectId}</p>
                <p>Teacher ID: {quiz.teacherId}</p>
                {quiz.grade !== null && (
                    <p>Grade: {quiz.grade}</p>
                )}
                {quiz.submitted && quiz.grade === null && (
                    <p className="lock-message">Quiz already submitted</p>
                )}
            </div>
        );
    };

    useEffect(() => {
        axios.get("http://localhost:3001/student/auth", { withCredentials: true })
            .then((response) => {
                const { studentId } = response.data;

                axios.get(`http://localhost:3001/student/${studentId}`, { params: { siteId: siteId }, withCredentials: true })
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

    const unfinishedQuizzes = studentData.quizzes.filter(quiz => !quiz.submitted);
    const submittedQuizzes = studentData.quizzes.filter(quiz => quiz.submitted);

    return (
        <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
            <h1>Welcome, Student</h1>

            <h2>Unfinished Quizzes:</h2>
            <div className="quizzes-container">
                {unfinishedQuizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                ))}
            </div>

            <h2>Submitted Quizzes:</h2>
            <div className="quizzes-container">
                {submittedQuizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                ))}
            </div>
        </div>
    );
}

export default StudentHome;
