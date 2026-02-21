let selectedId;
let selectedDiv;
const apiUrl = 'http://localhost:3000';

const saveNoteButton = document.getElementById('saveNote');
const noteTitleInput = document.getElementById('noteTitle');
const noteContentInput = document.getElementById('noteContent');
const notesContainer = document.getElementById('notesContainer');

// Carrega notas do servidor
fetch(`${apiUrl}/notes`)
    .then(response => response.json())
    .then(data => {
        data.forEach(note => {
            const created = note.creationDate ? new Date(note.creationDate).toLocaleString() : '';
            createNoteDiv(note.id, note.title, note.content, created);
        });
})
.catch(err => console.error('Erro ao carregar notas:', err));

saveNoteButton.addEventListener('click', () => {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (!title || !content) {
        alert('Por favor, preencha ambos os campos para salvar a nota.');
        return;
    }

    fetch(`${apiUrl}/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    })
    .then(response => {
        if (!response.ok) throw new Error('Falha ao salvar nota');
        return response.json();
    })
    .then(savedNote => {
        const created = savedNote.creationDate ? new Date(savedNote.creationDate).toLocaleString() : new Date().toLocaleString();
        createNoteDiv(savedNote.id, savedNote.title, savedNote.content, created);
        noteTitleInput.value = '';
        noteContentInput.value = '';
    })
    .catch(err => {
        console.error(err);
        alert('Não foi possível salvar a nota.');
    });
});

function createNoteDiv(id, title, content, creationDate) {
    const noteElement = document.createElement('div');
    noteElement.innerHTML = `
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(content)}</p>
        <small>${escapeHtml(creationDate)}</small>
    `;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add("deleteButton")
    deleteButton.textContent = "Excluir"
    
    const editButton = document.createElement('button');
    editButton.textContent = "Editar"

    deleteButton.addEventListener('click', () => {
        fetch(`${apiUrl}/note/${id}`, {
            method:"DELETE",
        })
        .then(response => {
            if (!response.ok) throw new Error('Falha ao deletar nota');

            noteElement.remove()
        })
    })

    editButton.addEventListener('click', () => {
        openModal()
        selectedId = id
        selectedDiv = noteElement
    })

    noteElement.appendChild(deleteButton);
    noteElement.appendChild(editButton);
    notesContainer.appendChild(noteElement);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function openModal() {
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function submitData() {
    const newTitle = document.getElementById('newTitle');
    const newContent = document.getElementById('newContent');

    fetch(`${apiUrl}/note/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.value, content: newContent.value })
    })
    .then(response => {
        if (!response.ok) throw new Error('Falha ao editar nota');
        
        selectedDiv.querySelector("h3").textContent = newTitle.value
        selectedDiv.querySelector("p").textContent = newContent.value
        
        newTitle.value = '';
        newContent.value = '';
    })
    .catch(err => {
        console.error(err);
        alert('Não foi possível editar a nota.');
    });

    closeModal();
}