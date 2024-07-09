import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

function TeacherHome() {
    const navigate = useNavigate();
    const [teacherData, setTeacherData] = useState(null);
    const { id: siteId } = useParams();

    useEffect(() => {
        axios.get("http://localhost:3001/teacher/auth", { withCredentials: true })
            .then((response) => {
                const { teacherId } = response.data;

                axios.get(`http://localhost:3001/teacher/${teacherId}`, { params: { siteId }, withCredentials: true })
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

    const handleGradeQuiz = (quizId) => {
        axios.post(`http://localhost:3001/quiz/${quizId}/grade`,{},{ withCredentials: true })
            .then(response => {
                alert("Grading completed");
                navigate(`/teacher/${siteId}`)
            })
            .catch(error => {
                console.error("Error grading quiz:", error);
            });
    };

    if (!teacherData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Welcome Teacher</h2>
            <p>{teacherData.message}</p>
            <p><Link to="/createquiz">Create Quiz</Link></p>

            <h3>Your Quizzes</h3>
            <div className="quizzes-container">
                {teacherData.data && teacherData.data.map((quiz) => (
                    <div key={quiz.id} className="quiz-card">
                        <h4>{quiz.title}</h4>
                        <p>Subject ID: {quiz.subjectId}</p>
                        <p>Quiz ID: {quiz.id}</p>
                        <p>Status: {quiz.graded ? 'Graded' : 'Not Graded'}</p>
                        {!quiz.graded && (
                            <button onClick={() => handleGradeQuiz(quiz.id)}>Grade</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TeacherHome;
