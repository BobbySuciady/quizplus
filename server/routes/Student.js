const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {Students} = require('../models');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middleware/AuthMiddleware');
const cookieParser = require('cookie-parser');

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await Students.create({ username, password: hash });
        res.json("SUCCESS");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Signup failed" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await Students.findOne({ where: { username: username } });
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
    res.json(req.user);
});

module.exports = router;