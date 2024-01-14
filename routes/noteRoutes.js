const express = require('express');
const User = require('../database/models/User');
const Notes = require('../database/models/Notes');
const { handleErrorResponse } = require('../utils');
const app = require('../app/app');

const router = express.Router();

router.get('/all', async function(res, res) {
    try {
        const notes = await Notes.findAll();

        res.status(200).json({success: true, message: "Notes", data: notes});
    } catch (error) {
        handleErrorResponse(res, error, 'Error retrieving notes');
    }
})

router.get('/userNotes', async function(req, res){
    try {

        const userId=req.body.userId;

        const user = await User.findByPk(userId);

        if(!user) {
            return res.status(404).json({ success: false, message: `User not found : ${userId}`, data: {} });
        }
        
        const notes = await Notes.findAll({
            where: {
                userId: userId
            }
        })

        return res.status(200).json({ success: true, message: 'Notes found', data: notes })
    } catch (error) {
        handleErrorResponse(res, error, 'Error retrieving notes')
    }
})

router.post('/addNote', async function(req, res) {
    try {
        const {title,notite,materie,data,tag,userId} = req.body;

        const note = await Notes.create({
            title: title,
            notite: notite,
            materie: materie,
            data: new Date(`${data}T00:00:00.000Z`),
            tag: tag,
            userId: userId
        })

        res.status(201).json({success: true, message: "Note Created", data: note});
    } catch (error) {
        handleErrorResponse(res, error, 'Error creating note');
    }
})

router.put('/update/:id', async function(req, res) {
    try {
        const noteId = req.params.id;

        const note = await Notes.findByPk(noteId);

        if(!note) {
            res.status(404).json({ success: false, message: 'Note not found', data: {} });
        }

        const updatedNote = await note.update(req.body);

        return res.status(200).json({ success: true, message: 'Note updated', data: updatedNote })
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

module.exports = router;