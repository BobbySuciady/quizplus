import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Quiz() {
    const { id } = useParams(); // Get the quiz ID from the URL
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({}); // Store student answers

    useEffect(() => {
        axios.get(`http://localhost:3001/quiz/${id}`, { withCredentials: true })
            .then((response) => {
                setQuiz(response.data);
            })
            .catch((error) => {
                console.error("Error fetching quiz data:", error);
            });
    }, [id]);

    const handleChange = (questionId, text) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: text
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const answersArray = Object.keys(answers).map(questionId => ({
            questionId,
            text: answers[questionId]
        }));

        axios.post(`http://localhost:3001/quiz/submit/${id}`, { answers: answersArray }, { withCredentials: true })
            .then(() => {
                alert('Quiz submitted successfully!');
                axios.get('http://localhost:3001/student/auth',{ withCredentials: true } ).then((response) => {
                    navigate(`/${response.data.studentId}`)
                })
                
            })
            .catch((error) => {
                console.error("Error submitting quiz:", error);
            });
    };

    if (!quiz) {
        return <div>Loading...</div>;
    }

    return (
        <div className="quiz-container">
            <h1>{quiz.title}</h1>
            <p>Subject ID: {quiz.subjectId}</p>
            <p>Teacher ID: {quiz.teacherId}</p>
            <form onSubmit={handleSubmit}>
                <div className="questions">
                    {quiz.questions.map((question) => (
                        <div key={question.id} className="question">
                            <p>{question.text}</p>
                            <input
                                type="text"
                                value={answers[question.id] || ''}
                                onChange={(e) => handleChange(question.id, e.target.value)}
                                required
                            />
                        </div>
                    ))}
                </div>
                <button type="submit">Submit Quiz</button>
            </form>
        </div>
    );
}

export default Quiz;
