import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import CanvasDraw from 'react-canvas-draw';
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
    const canvasRefs = useRef({});

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

    const handleCanvasChange = (questionId) => {
        const canvas = canvasRefs.current[questionId];
        if (canvas) {
            const drawingDataURL = canvas.getDataURL('image/png');
            setAnswers(prevAnswers => ({
                ...prevAnswers,
                [questionId]: drawingDataURL
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        const answersData = Object.keys(answers).map(questionId => ({
            questionId,
            text: answers[questionId] ? answers[questionId].name : null
        }));
        formData.append('answers', JSON.stringify(answersData));
    
        // Add drawings to formData
        for (const questionId in canvasRefs.current) {
            const canvas = canvasRefs.current[questionId];
            if (canvas) {
                const drawingDataURL = canvas.getDataURL('image/png');
                const drawingBlob = dataURLtoBlob(drawingDataURL);
                formData.append(`answer_${questionId}`, drawingBlob, `${questionId}.png`);
            }
        }
    
        try {
            await axios.post(`http://localhost:3001/quiz/submit/${quizId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            alert('Quiz submitted successfully!');
            const response = await axios.get('http://localhost:3001/student/auth', { withCredentials: true });
            navigate(`/${response.data.studentId}`);
        } catch (error) {
            console.error("Error submitting quiz:", error);
        }
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

    const preprocessFeedback = (feedback) => {
        return feedback
            .replace(/\\\(/g, '$')
            .replace(/\\\)/g, '$')
            .replace(/\\\[/g, '$$')
            .replace(/\\\]/g, '$$');
    };

    const dataURLtoBlob = (dataURL) => {
        const binary = atob(dataURL.split(',')[1]);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: 'image/png' });
    };

    const getStudentAnswerImageURL = (answer) => {
        const correctedPath = answer.replace('..\\client\\uploads\\', 'uploads/');
        return `http://localhost:3001/${correctedPath}`;
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
                                <p>Your Answer:</p>
                                {studentAnswer && studentAnswer.answer && (
                                    <img src={getStudentAnswerImageURL(studentAnswer.answer)} alt="Student Answer" />
                                )}
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
                                            {transformText(preprocessFeedback(studentAnswer.feedback))}
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
                                                {transformText(preprocessFeedback(chatResponses[question.id]))}
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
                                <CanvasDraw
                                    ref={(canvas) => canvasRefs.current[question.id] = canvas}
                                    canvasWidth={800}
                                    canvasHeight={800}
                                    brushRadius={2}
                                    lazyRadius={0}
                                    hideGrid={true}
                                    onChange={() => handleCanvasChange(question.id)}
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
