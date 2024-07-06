const express = require('express');
const router = express.Router();
const { Quiz, Question, Answer, Subject, StudentAnswer } = require('../models');
const { validateToken } = require('../middleware/AuthMiddleware');

router.post('/create', validateToken, async (req, res) => {
  const { title, questions, subjectId } = req.body; 
  const teacherId = req.user.id;

  try {
    const quiz = await Quiz.create({ title, teacherId, subjectId }); 

    for (const question of questions) {
      const newQuestion = await Question.create({ quizId: quiz.id, text: question.text });

      for (const answer of question.answers) {
        await Answer.create({
          questionId: newQuestion.id,
          text: answer.text,
        });
      }
    }

    res.status(201).json({ message: 'Quiz created successfully' });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
      const quiz = await Quiz.findOne({
        where: { id: req.params.id },
        include: [
            { model: Question, as: 'questions' }, 
        ]
      });
      
      if (!quiz) {
          return res.status(404).json({ error: 'Quiz not found' });
      }

      res.json(quiz);
  } catch (error) {
      console.error('Error fetching quiz:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/submit/:id', validateToken, async (req, res) => {
  const { answers } = req.body;
  const studentId = req.user.id;

  try {
      for (const answer of answers) {
          await StudentAnswer.create({
              studentId,
              questionId: answer.questionId,
              answer: answer.text
          });
      }

      res.status(200).json({ message: 'Quiz submitted successfully' });
  } catch (error) {
      console.error('Error submitting quiz:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
