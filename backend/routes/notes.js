const express = require('express')
const router = express.Router()
const Note = require('../models/Notes')
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');

//Route 1:Get All The Notes Using:GET "./api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error')
    }

})

//Route 2:Add All The Notes Using:POST "./api/auth/addnote"
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description should b atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id,
        })
        const savedNote = await note.save();
        res.json(savedNote)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error')
    }
})

//Route 3: Upadte The Notes Using:PUT "./api/notes/addnote" login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body

    try {
        //create a new Note object
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //find the note to be updated and update it
        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).json({ msg: "note not found" }) }
        if (note.user.toString() !== req.user.id) {
            return res.status(404).json({ msg: "not allowed" })
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error')
    }

})


//Route 4: Delete The Notes Using:PUT "./api/notes/deletenote" login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body
    try {
        //find the note to be updated and update it
        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).json({ msg: "note not found" }) }
        if (note.user.toString() !== req.user.id) {
            return res.status(404).json({ msg: "not allowed" })
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "success": "Note has been deleted", note: note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error')
    }
})




module.exports = router