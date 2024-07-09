const express = require('express');
const router = express.Router();
const { Quiz, Question, Answer, Subject, StudentAnswer, StudentResult } = require('../models');
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

router.get('/:id', validateToken, async (req, res) => {
  const {id : quizId} = req.params
  const {id: studentId} = req.user
  try {
    const quiz = await Quiz.findOne({
        where: { id: quizId },
        include: [{
            model: Question,
            as: 'questions'
        }]
    });

    if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
    }

    const studentAnswers = await StudentAnswer.findAll({
        where: {
            studentId: studentId,
            quizId: quizId
        }
    });

    res.json({
        quiz,
        studentAnswers
    });
} catch (error) {
    console.error('Error fetching quiz details:', error);
    res.status(500).json({ error: 'Error fetching quiz details' });
}
});

router.post('/submit/:id', validateToken, async (req, res) => {
  const { id } =  req.params
  const { answers } = req.body;
  const studentId = req.user.id;

  try {
      for (const answer of answers) {
          await StudentAnswer.create({
              studentId,
              questionId: answer.questionId,
              quizId: id,
              answer: answer.text
          });
      }

      res.status(200).json({ message: 'Quiz submitted successfully' });
  } catch (error) {
      console.error('Error submitting quiz:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:quizId/grade', async (req, res) => {
  const { quizId } = req.params;

  try {
    // Check if the quiz has already been graded
    const existingResults = await StudentResult.findOne({ where: { quizId } });
    if (existingResults) {
      return res.status(400).json({ message: "This quiz has already been graded." });
    }

    // Find all questions for the quiz
    const questions = await Question.findAll({ where: { quizId } });
    console.log(questions)

    // Find all correct answers for the questions in the quiz
    const correctAnswers = await Answer.findAll({
        where: { questionId: questions.map(q => q.id) },
    });
    console.log(correctAnswers)

    // Find all student answers for the questions in the quiz
    const studentAnswers = await StudentAnswer.findAll({
        where: { questionId: questions.map(q => q.id) },
    });
    console.log(studentAnswers)

    // Autograde logic
    const grades = {}; // { studentId: grade }
    studentAnswers.forEach(studentAnswer => {
        if (!grades[studentAnswer.studentId]) {
            grades[studentAnswer.studentId] = 0;
        }
        // Check if the student's answer text matches the correct answer text
        const correctAnswer = correctAnswers.find(ans => ans.questionId === studentAnswer.questionId);
        const isCorrect = correctAnswer && studentAnswer.answer === correctAnswer.text;
        studentAnswer.isCorrect = isCorrect;
        studentAnswer.save();
        if (isCorrect) {
            grades[studentAnswer.studentId] += 1;
        }
    });
    console.log(grades)

    // Store or process grades as needed
    const saveResultsPromises = Object.entries(grades).map(async ([studentId, grade]) => {
      const totalQuestions = correctAnswers.length;
      const score = (grade / totalQuestions) * 100; // Calculate score as a percentage

      // Save the result
      await StudentResult.create({
          studentId: parseInt(studentId),
          quizId: parseInt(quizId),
          score
      });
  });

  // Wait for all save operations to complete
  await Promise.all(saveResultsPromises);

  res.json({ message: "Grades calculated and saved successfully." });

  } catch (error) {
      console.error("Error grading quiz:", error);
      res.status(500).json({ error: "Error grading quiz" });
  }
});





module.exports = router;
