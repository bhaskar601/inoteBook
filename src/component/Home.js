import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteContext from '../context/noteContext';

export default function Home() {
  const { notes, addNote, deleteNote, updateNote } = useContext(NoteContext);
  const [newNote, setNewNote] = useState({ id: null, title: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('https://backend-inotebook.vercel.app/api/user/getuser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUsername(data.name);
        } else {
          console.error('❌ Failed to fetch user');
        }
      } catch (err) {
        console.error('❌ Error fetching user:', err);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setNewNote({ ...newNote, [e.target.name]: e.target.value });
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    addNote(newNote.title, newNote.description);
    setNewNote({ id: null, title: '', description: '' });
  };

  const handleEdit = (note) => {
    setNewNote({ id: note._id, title: note.title, description: note.description });
    setIsEditing(true);
    setShowModal(true);
    setMenuOpenId(null);
  };

  const handleUpdateNote = () => {
    updateNote(newNote.id, newNote.title, newNote.description);
    setIsEditing(false);
    setNewNote({ id: null, title: '', description: '' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('🗑️ Are you sure you want to delete this note?')) {
      deleteNote(id);
    }
    setMenuOpenId(null);
  };

  const colors = ['#a8dadc', '#ffb6b9', '#d0f4de', '#e4c1f9', '#ffe0ac', '#b8f2e6'];

  const token = localStorage.getItem('token');
  if (!token) {
    return (
      <div className="container text-center mt-5">
        <h4 className="text-danger fw-bold">🚫 Please log in to access your notes.</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 py-5" style={{ background: 'linear-gradient(to right, #284868ff, #25565eff)' }}>
      <div className="container text-light">
        <div className="mb-4">
          <h2 className="text-center fw-bold display-6">📝 Add a Note</h2>
      <p className="fs-5 fw-bold">
  <span style={{ color: 'white' }}>👤</span> Good Day, {username}
</p>


        </div>

       <form className="mb-5 glass-card p-4 rounded" style={{ background: 'rgba(236, 235, 229, 0.05)', backdropFilter: 'blur(10px)' }} onSubmit={handleAddNote}>
  <div className="mb-3">
    <label htmlFor="title" className="form-label fw-semibold">Title</label>
    <input
      type="text"
      className="form-control bg-light text-dark border-0 shadow-sm"
      id="title"
      name="title"
      value={newNote.title}
      onChange={handleChange}
      required
      minLength={1}
    />
  </div>

  <div className="mb-3">
    <label htmlFor="description" className="form-label fw-semibold">Description</label>
    <textarea
      className="form-control bg-light text-dark border-0 shadow-sm"
      id="description"
      name="description"
      value={newNote.description}
      onChange={handleChange}
      rows="3"
      required
      minLength={1}
    ></textarea>
  </div>


         <button type="submit" className="btn btn-success w-100 rounded-pill fw-bold">
  Add Note
</button>

        </form>

        <h3 className="mb-3 fw-bold">🗂️ Your Notes</h3>
        <div className="row">
          {notes.length === 0 && <p>No notes to display.</p>}
          {notes.map((note, index) => (
            <div className="col-md-4 my-3" key={note._id}>
              <div
                className="card text-dark shadow position-relative"
                style={{
                  backgroundColor: colors[index % colors.length],
                  borderRadius: '1rem',
                }}
              >
                <div className="card-body">
                  <h5 className="card-title fw-bold">{note.title}</h5>
                  <p className="card-text">{note.description}</p>

                  <div
                    className="position-absolute top-0 end-0 m-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      setMenuOpenId(menuOpenId === note._id ? null : note._id)
                    }
                  >
                    &#x22EE;
                  </div>

                  {menuOpenId === note._id && (
                    <div
                      ref={menuRef}
                      className="position-absolute end-0 mt-2 p-2 bg-white border rounded shadow"
                      style={{ zIndex: 1000 }}
                    >
                      <button
                        className="btn btn-sm btn-warning w-100 mb-1"
                        onClick={() => handleEdit(note)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger w-100"
                        onClick={() => handleDelete(note._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Update Note</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="modal-title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="modal-title"
                    name="title"
                    value={newNote.title}
                    onChange={handleChange}
                    required
                    minLength={3}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="modal-description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="modal-description"
                    name="description"
                    value={newNote.description}
                    onChange={handleChange}
                    rows="3"
                    required
                    minLength={5}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdateNote}>Update</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-5">
        <hr />
        <h5 className="fw-bold text-light mb-0">🌟 All the Best, Rockstar! 🌟</h5>
      </div>
    </div>
  );
}
