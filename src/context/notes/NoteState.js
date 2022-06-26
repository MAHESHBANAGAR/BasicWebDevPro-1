import React, { useState } from 'react';
import NoteContext from './NoteContext.js';

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = [
        
    ]
    const [notes, setNotes] = useState(notesInitial);
//GET all notes
    const getNotes =async () => {
        //API call to add a note
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIwMTNiNTI5ZDFhZjI1OGRlMWJjZDdkIn0sImlhdCI6MTY0NTAyNzQ2MX0.58M9EzzBSu4c3KqHwz37FozRW04OT6q3BXccEPNj70Q'
            }
        }) 
        const json = await response.json()
        console.log(json)
        setNotes(json)
    }

    //Add a Note
    const addNote =async (title, description, tag) => {

        //API call to add a note
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIwMTNiNTI5ZDFhZjI1OGRlMWJjZDdkIn0sImlhdCI6MTY0NTAyNzQ2MX0.58M9EzzBSu4c3KqHwz37FozRW04OT6q3BXccEPNj70Q'
            },
            body: JSON.stringify({title,description,tag})
        })
        const json = await response.json();
        console.log(json)

        console.log("Adding a new notes")
        const note = {
            
            "user": "62013b529d1af258de1bcd7d",
            "title": title,
            "description": description,
            "tag": tag,
            "_id": "620d1c927125518646e07557",
            "date": "2022-02-16T15:47:30.392Z",
            "__v": 0
        }
        setNotes(notes.concat(note));
    }
    //Delete a Note
    const deleteNote = async (id) => {
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIwMTNiNTI5ZDFhZjI1OGRlMWJjZDdkIn0sImlhdCI6MTY0NTAyNzQ2MX0.58M9EzzBSu4c3KqHwz37FozRW04OT6q3BXccEPNj70Q'
            }
            
        })
        const json = await response.json();
        console.log(json);

        console.log("deleting the note with" + id)
        const newNotes = notes.filter((note) => { return note._id !== id; });
        setNotes(newNotes);
    }
    //Edit a Note
    const editNote = async (id, description, title, tag) => {
        //API call to edit a note
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIwMTNiNTI5ZDFhZjI1OGRlMWJjZDdkIn0sImlhdCI6MTY0NTAyNzQ2MX0.58M9EzzBSu4c3KqHwz37FozRW04OT6q3BXccEPNj70Q'
            },
            body: JSON.stringify({title, description, tag})
        })
        const json = await response.json();
        //logic to delete the note
        for (let index = 0; index < notes.length; index++) {
            const element = notes[index];
            if (element._id === id) {
                element.title = title;
                element.description = description;
                element.tag = tag;
            }
        }
    }

    return (
        <NoteContext.Provider value={{ notes, setNotes, addNote, deleteNote, editNote,getNotes }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
