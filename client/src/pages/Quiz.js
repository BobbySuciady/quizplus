import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


function Quiz() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/quiz/${id}`, { withCredentials: true })
            .then((response) => {
                setQuiz(response.data);
            })
            .catch((error) => {
                console.error("Error fetching quiz data:", error);
            });
    }, [id]);

    if (!quiz) {
        return <div>Loading...</div>;
    }

    return (
        <div className="quiz-container">
            <h1>{quiz.title}</h1>
            <p>Subject ID: {quiz.subjectId}</p>
            <div className="questions">
                {quiz.questions.map((question) => (
                    <div key={question.id} className="question">
                        <p>{question.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Quiz;
