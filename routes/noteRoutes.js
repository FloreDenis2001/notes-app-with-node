const express = require('express');
const User = require('../database/models/User');
const Notes = require('../database/models/Notes');
const Enrollment = require('../database/models/Enrollment');
const { handleErrorResponse } = require('../utils');
const app = require('../app/app');

const router = express.Router();

router.post('/shareNoteByEmail', async function (req, res) {
    try {
        const { noteId, email } = req.body;

        const note = await Notes.findByPk(noteId);
        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found', data: {} });
        }

        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', data: {} });
        }

        const existingShare = await Enrollment.findOne({
            where: {
                noteId: noteId,
                userId: user.id
            }
        });

        if (existingShare) {
            return res.status(400).json({ success: false, message: 'Note is already shared with the user', data: {} });
        }

        await Enrollment.create({
            noteId: noteId,
            userId: user.id,
            status: 'shared'
        });

        return res.status(201).json({ success: true, message: 'Note shared successfully', data: {} });
    } catch (error) {
        handleErrorResponse(res, error, 'Error sharing note');
    }
});

router.get('/all', async function (res, res) {
    try {
        const notes = await Notes.findAll();

        return res.status(200).json(notes);

    } catch (error) {
        handleErrorResponse(res, error, 'Error retrieving notes');
    }
})

router.get('/userNotes/:id', async function (req, res) {
    try {

        const userId = req.params.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: `User not found : ${userId}`, data: {} });
        }

        const enrollment = await Enrollment.findAll({
            where: {
                userId: userId,
            }
        })

        const notes = await Notes.findAll({
            where: {
                id: enrollment.map(e => e.noteId),
                isTrash: false
            }
        });


        return res.status(200).json(notes);

    } catch (error) {
        handleErrorResponse(res, error, 'Error retrieving notes')
    }
})
router.get('/userTrash/:id', async function (req, res) {
    try {

        const userId = req.params.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: `User not found : ${userId}`, data: {} });
        }

        const enrollment = await Enrollment.findAll({
            where: {
                userId: userId,
                status: 'owner'
            }
        })

        const notes = await Notes.findAll({
            where: {
                id: enrollment.map(e => e.noteId),
                isTrash: true
            }
        });


        return res.status(200).json(notes);

    } catch (error) {
        handleErrorResponse(res, error, 'Error retrieving notes')
    }
})


router.get('/shareOwner/:id', async function (req, res) {
    try {
        const noteId = req.params.id;
        const note = await Notes.findByPk(noteId);

        if (!note) {
            return res.status(404).json({ success: false, message: `Note not found : ${noteId}`, data: {} });
        }

        const enrollments = await Enrollment.findAll({
            where: {
                noteId: noteId,
                status: 'owner'
            }
        });

        const userIds = enrollments.map(e => e.userId);

        const users = await User.findAll({
            where: {
                id: userIds
            },
            attributes: ['id', 'email']
        });

        if (!users) {
            return res.status(404).json({ success: false, message: `Users not found : ${noteId}`, data: {} });
        }

        return res.status(200).json( users[0]);
    } catch (error) {
        handleErrorResponse(res, error, 'Error retrieving notes');
    }
});



router.put('/trash', async function (req, res) {
    try {


        const { userId, noteId } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: `User not found : ${userId}`, data: {} });
        }

        const enrollment = await Enrollment.findAll({
            where: {
                userId: userId,
                noteId: noteId
            }
        });

        if (!enrollment) {
            return res.status(404).json({ success: false, message: `Enrollment not found for User ${userId} and Note ${noteId}`, data: {} });
        }

        if (enrollment[0].status !== 'owner') {
            return res.status(401).json({ success: false, message: `User ${userId} is not the owner of the note ${noteId}`, data: {} });
        }


        const note = await Notes.findByPk(noteId);

        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found', data: {} });
        }

        await note.update({ isTrash: true });

        return res.status(200).json({ success: true, message: 'Note updated successfully', data: note });


    } catch (error) {
        handleErrorResponse(res, error, 'Error retrieving notes')
    }
})

router.post('/addNote', async function (req, res) {
    try {
        const { title, notite, materie, tag, userId } = req.body;

        const user = await User.findByPk(userId);


        const note = await Notes.create({
            title: title,
            notite: notite,
            materie: materie,
            tag: tag,
            isTrash: false,
        })



        const enrollment = await Enrollment.create({
            noteId: note.id,
            userId: userId,
            status: 'owner'
        });



        return res.status(201).json(enrollment);
    } catch (error) {
        handleErrorResponse(res, error, 'Error creating note');
    }
})

router.put('/update/', async function (req, res) {
    try {
        const { title, notite, materie, tag, userId, noteId } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: `User not found : ${userId}`, data: {} });
        }

        const enrollment = await Enrollment.findAll({
            where: {
                userId: userId,
                noteId: noteId
            }
        });

        if (!enrollment) {
            return res.status(404).json({ success: false, message: `Enrollment not found for User ${userId} and Note ${noteId}`, data: {} });
        }




        const note = await Notes.findByPk(noteId);

        if (!note) {
            res.status(404).json({ success: false, message: 'Note not found', data: {} });
        }


        const updatedNote = await note.update({
            title: title,
            notite: notite,
            materie: materie,
            tag: tag,
        });

        return res.status(200).json(updatedNote);
    } catch (error) {
        handleErrorResponse(res, error, 'Error updating note');
    }
})

router.delete('/delete/:id', async function (req, res) {
    try {
        const id = req.params.id;

        const note = await Notes.findByPk(id);

        if (!note) {
            res.status(404).json({ success: false, message: 'Note not found', data: {} });
        }

        await note.destroy();

        return res.status(200).json({ success: true, message: 'Note deleted', data: {} })
    } catch (error) {
        handleErrorResponse(res, error, 'Error retrieving users');
    }
})


router.put('/restore/:id', async function (req, res) {
    try {
        const id = req.params.id;

        const note = await Notes.findByPk(id);

        if (!note) {
            res.status(404).json({ success: false, message: 'Note not found', data: {} });
        }

        const updatedNote = await note.update({ isTrash: false });

        return res.status(200).json(updatedNote);
    } catch (error) {
        handleErrorResponse(res, error, 'Error updating note');
    }
})


module.exports = router;