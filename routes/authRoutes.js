const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/models/User');
const { handleErrorResponse } = require('../utils');


const router = express.Router();

router.post('/login', async function (req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(404).json({
                id: 0,
                email: "NOEMAIL",
                token: "NOTOKEN",
                success: false,
                message: "User not found",
                data: {}
            });
        }

        if (!user.email.endsWith("@stud.ase.ro")) {
            return res.status(401).json({
                id: 0,
                email: "NOEMAIL",
                token: "NOTOKEN",
                success: false,
                message: "Invalid email",
                data: {}
            });
        }

        const validPassword = bcrypt.compareSync(password, user.dataValues.password);

        if (!validPassword) {
            return res.status(401).json({
                id: 0,
                email: "NOEMAIL",
                token: "NOTOKEN",
                success: false,
                message: "Invalid password",
                data: {}
            });
        }

        const uniqueSecret = `${process.env.TOKEN_SECRET}_${Date.now()}`;

        const token = jwt.sign({ id: user.dataValues.id }, uniqueSecret, {
            expiresIn: '1h'
        });

        res.status(200).json({
            id: user.dataValues.id,
            email: user.dataValues.email,
            username: user.dataValues.username,
            token: token,
        });
    } catch (error) {
        handleErrorResponse(res, error, 'Error login user');
    }
});



router.post('/check', async function (req, res) {
    const token = req.body.token;

    if (!token) {
        return res.status(404).json({ success: false, message: 'Token not found', data: {} });
    }

    const validToken = jwt.verify(token, process.env.TOKEN_SECRET);

    if (!validToken) {
        return res.status(404).json({ success: false, message: 'Invalid token', data: {} });
    }

    return res.status(200).json({ success: true, message: "Valid token", data: { token } });
})

module.exports = router;