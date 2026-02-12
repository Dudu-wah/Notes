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

app.post("/note", (req, res) => {
    const note = {
        title: req.body.title,
        content: req.body.content,
        creationDate: new Date()
    }
    notes.push(note)
    res.status(201).json(note)
})

app.get("/notes", (req, res) => {
    res.status(200).json(notes)
})