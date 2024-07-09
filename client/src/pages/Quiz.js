import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Quiz() {
    const { id: quizId } = useParams(); // Get the quiz and student ID from the URL
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [studentAnswers, setStudentAnswers] = useState([]);
    const [answers, setAnswers] = useState({}); // Store student answers for submission

    useEffect(() => {
        axios.get(`http://localhost:3001/quiz/${quizId}`, { withCredentials: true })
            .then((response) => {
                setQuiz(response.data.quiz);
                setStudentAnswers(response.data.studentAnswers);
            })
            .catch((error) => {
                console.error("Error fetching quiz data:", error);
            });
    }, [quizId]);

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

        axios.post(`http://localhost:3001/quiz/submit/${quizId}`, { answers: answersArray }, { withCredentials: true })
            .then(() => {
                alert('Quiz submitted successfully!');
                axios.get('http://localhost:3001/student/auth', { withCredentials: true }).then((response) => {
                    navigate(`/${response.data.studentId}`);
                });
            })
            .catch((error) => {
                console.error("Error submitting quiz:", error);
            });
    };

    if (!quiz) {
        return <div>Loading...</div>;
    }

    const isGraded = studentAnswers.length > 0;

    return (
        <div className="quiz-container">
            <h1>{quiz.title}</h1>
            <p>Subject ID: {quiz.subjectId}</p>
            <p>Teacher ID: {quiz.teacherId}</p>
            {isGraded ? (
                <div className="questions">
                    {quiz.questions.map((question) => {
                        const studentAnswer = studentAnswers.find(ans => ans.questionId === question.id);
                        const isCorrect = studentAnswer && studentAnswer.isCorrect;

                        return (
                            <div key={question.id} className={`question ${isCorrect ? 'correct' : 'incorrect'}`}>
                                <p>{question.text}</p>
                                <p>Your Answer: {studentAnswer ? studentAnswer.answer : 'Not answered'}</p>
                                {studentAnswer && (
                                    <p className={`answer-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                                        {isCorrect ? 'Correct' : 'Incorrect'}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
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
            )}
        </div>
    );
}

export default Quiz;
