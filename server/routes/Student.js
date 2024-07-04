const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {Student, Subject, Quiz} = require('../models');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middleware/AuthMiddleware');
const cookieParser = require('cookie-parser');

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await Student.create({ username, password: hash });
        res.json("SUCCESS");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Signup failed" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await Student.findOne({ where: { username: username } });
    const stayLoggedInDays = 3;

    if (!user) {
        return res.json({ error: "user doesn't exist" });
    } else {
        bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                return res.json({ error: "Wrong username and password combination" });
            } else {
                const accessToken = sign({ username: user.username, id: user.id }, "importantsecret");
                res.cookie('accessToken', accessToken, { 
                    httpOnly: true, 
                    secure:true, 
                    expires: new Date(Date.now() + 1000 * 86400 * stayLoggedInDays) 
                });
                return res.json({ username: username, id: user.id });
            }
        });
    }
});

router.get('/auth', validateToken, (req, res) => {
    const { id } = req.user; 
    res.json({ studentId: id });
});

router.get('/:studentId', validateToken, async (req, res) => {
    const { studentId } = req.params;
    const { id } = req.query.siteId;

    if (Number(id) !== Number(studentId)) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
        const studentSubjects = await Subject.findAll({
            include: [{
                model: Student,
                as: 'students',
                where: { id: studentId },
                through: 'StudentSubjects', 
            }], 
        });
        const subjectIds = studentSubjects.map(subject => subject.subjectId);

        // Fetch quizzes for the subjects
        const studentQuizzes = await Quiz.findAll({
            where: { subjectId: subjectIds },
        });

        res.json({ subjects: studentSubjects, quizzes: studentQuizzes });

    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Error fetching subjects' });
    }


});

module.exports = router;