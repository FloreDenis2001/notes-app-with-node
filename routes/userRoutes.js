const express = require('express');
const bcrypt = require('bcrypt');
const { handleErrorResponse } = require('../utils');
const User = require('../database/models/User')

const router = express.Router();

router.get('/all', async function (req, res) {
    try {
        const users = await User.findAll();
        users?.forEach(user => {
            delete user.dataValues.password;
        })
        res.status(200).json(users);
    } catch (error) {
        handleErrorResponse(res, error, 'Error retrieving users');
    }
})

router.get('/:id', async function (req, res) {
    try {
        const id = req.params.id;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', data: {} });
        }

        delete user.dataValues.password;

        return res.status(200).json({ success: true, message: 'User was found', data: user })
    } catch (error) {
        handleErrorResponse(res, error, 'Error retrieving users');
    }
})

router.post('/addUser', async function (req, res) {
    try {
        const { username, password, email } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists", data: {} });
        }

        if (!email.endsWith('@stud.ase.ro')) {
            return res.status(400).json({ success: false, message: "Email is invalid", data: {} });
        }


        const user = await User.create({
            username: username,
            password: hash,
            email: email,
        });

        delete user.dataValues.password;

        res.status(201).json(user);
    } catch (error) {
        handleErrorResponse(res, error, 'Error creating user');
    }
});

router.put('/update/:id', async function (req, res) {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', data: {} });
        }

        if (req.body.password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

            req.body.password = hashedPassword;
        }

        const updatedUser = await user.update(req.body);

        delete updatedUser.dataValues.password;

        return res.status(200).json({ success: true, message: 'User updated', data: updatedUser });
    } catch (error) {
        handleErrorResponse(res, error, 'Error updating user');
    }
});


router.delete('/delete/:id', async function (req, res) {
    try {
        const id = req.params.id;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', data: {} });
        }

        await user.destroy();

        return res.status(200).json({ success: true, message: 'User deleted', data: {} })
    } catch (error) {
        handleErrorResponse(res, error, 'Error retrieving users');
    }
})

module.exports = router;