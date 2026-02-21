// server.js
const express = require('express');
const path = require('path');
const app = express()
const PORT = 3000;

app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

const notes = []
let nextID = 0

app.post("/note", (req, res) => {
    const note = {
        id: nextID++,
        title: req.body.title,
        content: req.body.content,
        creationDate: new Date(),
    }
    notes.push(note)
    res.status(201).json(note)
})

app.get("/notes", (req, res) => {
    res.status(200).json(notes)
})

app.delete("/note/:id", (req, res) => {
    const idToRemove = Number(req.params.id)

    let currentIndex = 0
    for (const note of notes){
        if (note.id === idToRemove){
            notes.splice(currentIndex, 1)
            res.status(200).send()
            return
        }
        currentIndex++
    }
    res.status(404).send()
})

app.put("/note/:id", (req, res) => {
    const id = Number(req.params.id)

    for (const note of notes){
        if (note.id === id){
            note.title = req.body.title
            note.content = req.body.content
            res.status(200).send()
            return
        }
    }
    res.status(404).send()
})

