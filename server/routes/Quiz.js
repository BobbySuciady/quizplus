const express = require('express');
const router = express.Router();
const { Quiz, Question, Answer, Subject, StudentAnswer, StudentResult } = require('../models');
const { validateToken } = require('../middleware/AuthMiddleware');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const fs = require('fs').promises;
const OpenAI = require('openai');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, '../client/uploads'); 
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });


router.post('/create', validateToken, upload.any(), async (req, res) => {
  const { title, subjectId } = req.body; 
  const teacherId = req.user.id;
  const questions = JSON.parse(req.body.questions);

  try {
    const quiz = await Quiz.create({ title, teacherId, subjectId }); 

    for (const question of questions) {
      const newQuestion = await Question.create({ quizId: quiz.id, text: question.text });

      for (const answer of question.answers) {
        const answerFile = req.files.find(file => file.fieldname === `questions[${questions.indexOf(question)}][answers][${question.answers.indexOf(answer)}][file]`);
        await Answer.create({
          questionId: newQuestion.id,
          text: answerFile.path,
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

router.post('/submit/:id', validateToken, upload.any(), async (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;

  try {
    const answers = req.body.answers ? JSON.parse(req.body.answers) : [];

    for (const answer of answers) {
      const answerFile = req.files.find(file => file.fieldname === `answer_${answer.questionId}`);
      await StudentAnswer.create({
        studentId,
        questionId: answer.questionId,
        quizId: id,
        answer: answerFile ? answerFile.path : ''
      });
    }

    res.status(200).json({ message: 'Quiz submitted successfully' });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const openai = new OpenAI({
  apiKey: '',
});

async function encodeImage(imagePath) {
  const imageBuffer = await fs.readFile(imagePath);
  return imageBuffer.toString('base64');
}

async function compareImages(questionText, teacherImagePath, studentImagePath) {
  try {
    const teacherImageBase64 = await encodeImage(teacherImagePath);
    const studentImageBase64 = await encodeImage(studentImagePath);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `Question: ${questionText}\n\nCompare the first image which is teacher answer and second image which is student answer. Reply 'correct' if student is correct based on teacher's answer. If incorrect, Provide detailed feedback explaining why the student's answer is correct or incorrect.` },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${teacherImageBase64}`,
              },
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${studentImageBase64}`,
              },
            }
          ],
        },
      ],
    });

    const content = response.choices[0].message.content.trim();
    const isCorrect = content.toLowerCase() === 'correct';
    const feedback = isCorrect ? '' : content;

    return { isCorrect, feedback };
    
  } catch (error) {
    console.error('Error comparing images:', error);
    throw error;
  }
}


router.post('/:quizId/question/:questionId/chat', validateToken, async (req, res) => {
  const { quizId, questionId } = req.params;
  const { message } = req.body;
  const { id: studentId } = req.user;

  try {
    const studentAnswer = await StudentAnswer.findOne({
      where: { studentId, questionId, quizId },
    });

    if (!studentAnswer) {
      return res.status(404).json({ error: 'Student answer not found' });
    }

    const question = await Question.findOne({
      where: { id: questionId },
    });

    const teacherAnswer = await Answer.findOne({
      where: { questionId },
    });

    if (!question || !teacherAnswer) {
      return res.status(404).json({ error: 'Question or teacher answer not found' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `The following is a quiz question along with the correct answer provided by the teacher and the student's incorrect answer. Please help the student understand why their answer is incorrect and provide detailed feedback.`,
        },
        {
          role: 'user',
          content: `Question: ${question.text}\nTeacher's Correct Answer: ${teacherAnswer.text}\nStudent's Answer: ${studentAnswer.answer}\n\nThe student answered incorrectly. ${message}`,
        },
        {
          role: 'assistant',
          content: studentAnswer.feedback,
        },
      ],
    });

    res.json({ response: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error interacting with ChatGPT:', error);
    res.status(500).json({ error: 'Error interacting with ChatGPT' });
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

    // Find all correct answers for the questions in the quiz
    const correctAnswers = await Answer.findAll({
      where: { questionId: questions.map(q => q.id) },
    });

    // Find all student answers for the questions in the quiz
    const studentAnswers = await StudentAnswer.findAll({
      where: { questionId: questions.map(q => q.id) },
    });

    const grades = {}; // { studentId: grade }

    for (const studentAnswer of studentAnswers) {
      if (!grades[studentAnswer.studentId]) {
        grades[studentAnswer.studentId] = 0;
      }

      // Fetch the file paths for teacher and student answers from the database
      const teacherAnswer = correctAnswers.find(ans => ans.questionId === studentAnswer.questionId);
      const questionText = questions.find(q => q.id === studentAnswer.questionId).text;
      const teacherAnswerPath = path.join(__dirname, '..', '..', 'client', 'uploads', path.basename(teacherAnswer.text));
      const studentAnswerPath = path.join(__dirname, '..', '..', 'client', 'uploads', path.basename(studentAnswer.answer));

      try {
        const { isCorrect, feedback } = await compareImages(questionText, teacherAnswerPath, studentAnswerPath);
        studentAnswer.isCorrect = isCorrect;
        studentAnswer.feedback = feedback;
        await studentAnswer.save();
        if (isCorrect) {
          grades[studentAnswer.studentId] += 1;
        }
      } catch (fileError) {
        console.error(`Error reading files for question ${studentAnswer.questionId}:`, fileError);
      }
    }

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
