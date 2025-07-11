import { useState } from 'react';
import NoteContext from './noteContext';

export default function NoteState(props) {
  const [notes, setNotes] = useState([
    { id: 1, title: 'First Note', description: 'This is your first note' },
    { id: 2, title: 'Second Note', description: 'This is your second note' }
  ]);

  // Add a note
  const addNote = (title, description) => {
    const newNote = {
      id: notes.length + 1,
      title,
      description
    };
    setNotes([...notes, newNote]);
  };

  // Delete a note
  const deleteNote = (id) => {
    const filteredNotes = notes.filter(note => note.id !== id);
    setNotes(filteredNotes);
  };

  // Update a note (basic example)
  const updateNote = (id, newTitle, newDescription) => {
    const updated = notes.map(note =>
      note.id === id ? { ...note, title: newTitle, description: newDescription } : note
    );
    setNotes(updated);
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, updateNote }}>
      {props.children}
    </NoteContext.Provider>
  );
}
