import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    axios.get("http://localhost:3001/teacher/auth", { withCredentials: true })
            .then((response) => {
                const { teacherId } = response.data;
                
                axios.get(`http://localhost:3001/teacher/subjects/${teacherId}`, {withCredentials: true})
                    .then((teacherResponse) => {
                      console.log(teacherResponse.data)
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
    setQuestions([...questions, { text: '', answers: [] }]);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = questions.slice();
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const addAnswer = (questionIndex) => {
    const newQuestions = questions.slice();
    newQuestions[questionIndex].answers.push({ text: '' });
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    const newQuestions = questions.slice();
    newQuestions[questionIndex].answers[answerIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/quiz/create', {
        title,
        questions,
        subjectId: selectedSubject,
      }, { withCredentials: true });

      setTitle('');
      setQuestions([]);
      setSelectedSubject('');
    } catch (error) {
      console.error('Error creating quiz:', error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quiz Title"
        required
      />
      <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required>
        <option value="" disabled>Select Subject</option>
        {subjects.map((subject) => (
          <option key={subject.subjectId} value={subject.subjectId}>
            {subject.name}
          </option>
        ))}
      </select>
      {questions.map((question, index) => (
        <div key={index}>
          <input
            type="text"
            value={question.text}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            placeholder="Question"
            required
          />
          {question.answers.map((answer, answerIndex) => (
            <div key={answerIndex}>
              <input
                type="text"
                value={answer.text}
                onChange={(e) => handleAnswerChange(index, answerIndex, e.target.value)}
                placeholder="Answer"
                required
              />
            </div>
          ))}
          <button type="button" onClick={() => addAnswer(index)}>Add Answer</button>
        </div>
      ))}
      <button type="button" onClick={addQuestion}>Add Question</button>
      <button type="submit">Create Quiz</button>
    </form>
  );
}

export default CreateQuiz;
