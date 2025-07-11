import React, { useContext, useState } from 'react';
import NoteContext from '../context/noteContext';

export default function Home() {
  const { notes, addNote, deleteNote, updateNote } = useContext(NoteContext);
  const [newNote, setNewNote] = useState({ id: null, title: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const handleChange = (e) => {
    setNewNote({ ...newNote, [e.target.name]: e.target.value });
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateNote(newNote.id, newNote.title, newNote.description);
      setIsEditing(false);
    } else {
      addNote(newNote.title, newNote.description);
    }
    setNewNote({ id: null, title: '', description: '' });
  };

  const handleEdit = (note) => {
    setNewNote({ id: note.id, title: note.title, description: note.description });
    setIsEditing(true);
    setMenuOpenId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this note?');
    if (confirmed) {
      deleteNote(id);
    }
    setMenuOpenId(null);
  };

  // Pastel color palette
  const colors = ['#fde2e4', '#e2f0cb', '#b5ead7', '#c7ceea', '#ffdac1', '#e4c1f9'];

  return (
    <div
      className="container-fluid min-vh-100 py-5"
      style={{
        background: 'linear-gradient(to right, #fdfbfb, #ebedee)',
      }}
    >
      <div className="container">
        <h2 className="mb-4 text-center">{isEditing ? 'Update Note' : 'Add a Note'}</h2>

        <form className="mb-5" onSubmit={handleAddNote}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control shadow-sm"
              id="title"
              name="title"
              value={newNote.title}
              onChange={handleChange}
              required
              minLength={3}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control shadow-sm"
              id="description"
              name="description"
              value={newNote.description}
              onChange={handleChange}
              rows="3"
              required
              minLength={5}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-success shadow">
            {isEditing ? 'Update Note' : 'Add Note'}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary ms-2 shadow"
              onClick={() => {
                setIsEditing(false);
                setNewNote({ id: null, title: '', description: '' });
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <h3 className="mb-3">Your Notes</h3>
        <div className="row">
          {notes.length === 0 && <p>No notes to display.</p>}
          {notes.map((note, index) => (
            <div className="col-md-4 my-3" key={note.id}>
              <div
                className="card shadow position-relative"
                style={{
                  backgroundColor: colors[index % colors.length],
                  borderRadius: '1rem',
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">{note.title}</h5>
                  <p className="card-text">{note.description}</p>

                  {/* Triple dot menu button */}
                  <div
                    className="position-absolute top-0 end-0 m-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      setMenuOpenId(menuOpenId === note.id ? null : note.id)
                    }
                  >
                    &#x22EE;
                  </div>

                  {/* Dropdown menu */}
                  {menuOpenId === note.id && (
                    <div
                      className="position-absolute end-0 mt-2 p-2 bg-white border rounded shadow"
                      style={{ zIndex: 1000 }}
                    >
                      <button
                        className="btn btn-sm btn-warning w-100 mb-1"
                        onClick={() => handleEdit(note)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger w-100"
                        onClick={() => handleDelete(note.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
