import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import '../Quiz.css'; // Ensure this CSS file is created and contains the necessary styles

function Quiz() {
    const { id: quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [studentAnswers, setStudentAnswers] = useState([]);
    const [answers, setAnswers] = useState({});
    const [chatMessages, setChatMessages] = useState({});
    const [chatResponses, setChatResponses] = useState({});

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

    const handleFileChange = (questionId, file) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: file
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('answers', JSON.stringify(Object.keys(answers).map(questionId => ({
            questionId,
            fileName: answers[questionId] ? answers[questionId].name : null
        }))));

        Object.keys(answers).forEach(questionId => {
            if (answers[questionId]) {
                formData.append(`answer_${questionId}`, answers[questionId]);
            }
        });

        axios.post(`http://localhost:3001/quiz/submit/${quizId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        })
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

    const handleChatChange = (questionId, message) => {
        setChatMessages((prevMessages) => ({
            ...prevMessages,
            [questionId]: message
        }));
    };

    const handleChatSubmit = (questionId) => {
        axios.post(`http://localhost:3001/quiz/${quizId}/question/${questionId}/chat`, {
            message: chatMessages[questionId]
        }, { withCredentials: true })
        .then((response) => {
            setChatResponses((prevResponses) => ({
                ...prevResponses,
                [questionId]: response.data.response
            }));
        })
        .catch((error) => {
            console.error("Error getting chat response:", error);
        });
    };

    const transformText = (text) => {
        return text.replace(/\$\$(.*?)\$\$/g, '$$$$\n$1\n$$$$')
                   .replace(/\$(.*?)\$/g, '$$\n$1\n$$');
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
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {transformText(question.text)}
                                </ReactMarkdown>
                                <p>Your Answer: {studentAnswer ? studentAnswer.answer : 'Not answered'}</p>
                                {studentAnswer && (
                                    <p className={`answer-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                                        {isCorrect ? 'Correct' : 'Incorrect'}
                                    </p>
                                )}
                                {!isCorrect && studentAnswer.feedback && (
                                    <div className="feedback">
                                        <h3>Feedback:</h3>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {transformText(studentAnswer.feedback)}
                                        </ReactMarkdown>
                                    </div>
                                )}
                                {!isCorrect && (
                                    <div className="chatbot">
                                        <textarea
                                            value={chatMessages[question.id] || ''}
                                            onChange={(e) => handleChatChange(question.id, e.target.value)}
                                            placeholder="Ask why your answer was incorrect or ask further..."
                                        ></textarea>
                                        <button onClick={() => handleChatSubmit(question.id)}>Ask</button>
                                        {chatResponses[question.id] && (
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm, remarkMath]}
                                                rehypePlugins={[rehypeKatex]}
                                            >
                                                {transformText(chatResponses[question.id])}
                                            </ReactMarkdown>
                                        )}
                                    </div>
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
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {transformText(question.text)}
                                </ReactMarkdown>
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => handleFileChange(question.id, e.target.files[0])}
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
