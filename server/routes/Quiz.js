const express = require('express');
const router = express.Router();
const { Quiz, Question, Answer, Subject } = require('../models');
const { validateToken } = require('../middleware/AuthMiddleware');

router.post('/create', validateToken, async (req, res) => {
  const { title, questions, subjectId } = req.body; // Add subjectId
  const teacherId = req.user.id;

  try {
    const quiz = await Quiz.create({ title, teacherId, subjectId }); // Include subjectId

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

module.exports = router;
