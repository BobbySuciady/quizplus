import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CreateQuiz.css';
import logo from '../images/logo.png';

function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    axios.get("http://localhost:3001/teacher/auth", { withCredentials: true })
      .then((response) => {
        const { teacherId } = response.data;

        axios.get(`http://localhost:3001/teacher/subjects/${teacherId}`, { withCredentials: true })
          .then((teacherResponse) => {
            console.log(teacherResponse.data);
            setSubjects(teacherResponse.data);
          })
          .catch((error) => {
            console.error("Error fetching teacher data:", error);
          });
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
      });
  }, []);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', answer: '' }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.slice();
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = questions.slice();
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (index, value) => {
    const newQuestions = questions.slice();
    newQuestions[index].answer = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/quiz/create', {
        title,
        questions,
        subjectId: selectedSubject,
        notes
      }, { withCredentials: true });

      setTitle('');
      setQuestions([]);
      setSelectedSubject('');
      setNotes('');
    } catch (error) {
      console.error('Error creating quiz:', error.response.data.error);
    }
  };

  return (
    <div className="create-quiz-container">
      <div className="logo-container">
        <img src={logo} alt="Quizplus Logo" className="logo" />
      </div>
      <form onSubmit={handleSubmit} className="create-quiz-form">
        <div className="form-group">
          <label>Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quiz Title"
            required
          />
        </div>
        <div className="form-group">
          <label>Subject</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="" disabled>Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.subjectId} value={subject.subjectId}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Quiz Notes / Instructions</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Quiz Notes / Instructions"
            rows="4"
            cols="50"
          />
        </div>
        {questions.map((question, index) => (
          <div key={index} className="form-group">
            <h3>Question {index + 1}</h3>
            <label>Question</label>
            <textarea
              value={question.text}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              placeholder="Question"
              required
            />
            <label>Answer</label>
            <textarea
              value={question.answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder={`Example Solution:
                            1. It takes 3 days on average for rainclouds to form on the seaside
                            2. Cloud moves for 1 or 2 days in shore
                            3. Cloud becomes heavy and rains completely in a day
                            4. Thus total rain cycle time is 3 + 1/2 + 1 = 5 or 6`}
              rows="4"
              cols="50"
              required
            />
            <button type="button" onClick={() => removeQuestion(index)}>Remove Question</button>
          </div>
        ))}
        <button type="button" className="add-question-button" onClick={addQuestion}>Add Question</button>
        <button type="submit" className="create-quiz-button">Create Quiz</button>
      </form>
    </div>
  );
}

export default CreateQuiz;
