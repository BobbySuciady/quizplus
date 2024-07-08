const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Teacher, Subject, Quiz, StudentResult } = require('../models');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middleware/AuthMiddleware');

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await Teacher.create({ username, password: hash });
        res.json("SUCCESS");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Signup failed" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await Teacher.findOne({ where: { username: username } });

    if (!user) {
        return res.json({ error: "User doesn't exist" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.json({ error: "Invalid password" });
    }

    const accessToken = sign({ username: user.username, id: user.id }, "importantsecret");
    const stayLoggedInDays = 3;
    res.cookie('accessToken', accessToken, { 
        httpOnly: true, 
        secure: true, 
        expires: new Date(Date.now() + 1000 * 86400 * stayLoggedInDays) 
    });
    return res.json({ username: user.username, id: user.id });
});

router.get('/auth', validateToken, (req, res) => {
    const { id } = req.user; 
    res.json({ teacherId: id });
});

router.get('/:teacherId', validateToken, async (req, res) => {
    const { teacherId } = req.params;
    const { siteId } = req.query;

    // Check if the authenticated user matches the requested teacherId
    if (Number(siteId) !== Number(teacherId)) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
        const quizzes = await Quiz.findAll({
            where: { teacherId: teacherId },
            include: {
              model: StudentResult,
              as:'results',
              attributes: ['id'], // Just check if there are any results
            },
          });
        if (!quizzes) {
            return res.json("no quizzes")
        }

        const quizzesWithStatus = quizzes.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            subjectId: quiz.subjectId,
            graded: quiz.results.length > 0, // Check if there are any grading results
          }));

        res.json({ message: `Access granted for teacherId ${teacherId}`, data: quizzesWithStatus });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching teacher data" });
    }
});

router.get('/subjects/:teacherId', validateToken, async (req, res) => {
    const {teacherId} = req.params;
    console.log(teacherId)

    try {
        const subjects = await Subject.findAll({
            include: [{
                model: Teacher,
                as: 'teachers',
                where: { id: teacherId },
                through: 'TeacherSubjects', 
            }], 
        });

        res.json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Error fetching subjects' });
    }
});
  
module.exports = router;
