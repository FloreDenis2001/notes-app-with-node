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
        })
        if (!user.email.endsWith("@stud.ase.ro")) {
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found", data: {} })
            }
            return res.status(401).json({ success: true, message: "Invalid email", data: {} })
        }
        const validPassword = bcrypt.compareSync(password, user.dataValues.password);

        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Invalid password", data: {} })
        }

        const token = jwt.sign({ id: user.dataValues.id }, process.env.TOKEN_SECRET, {
            expiresIn: '1h'
        })

        res.status(200).json({ success: true, message: "User found", data: { token } })
    } catch (error) {
        handleErrorResponse(res, error, 'Error login user');
    }
})

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