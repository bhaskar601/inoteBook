import { useContext } from 'react';
import NoteContext from '../context/noteContext';

export default function About() {
  const { notes } = useContext(NoteContext);

  return (
    <div className="container my-5 text-light">
      <div className="p-5 rounded shadow" style={{ background: 'linear-gradient(to right, #1a1628ff, #275662ff)' }}>
        <h2 className="mb-4">About iNotebook 📝</h2>
        <p>
          <strong>iNotebook</strong> is a powerful note-taking app designed to keep your thoughts organized.
        </p>

        <hr className="border-light" />

        <p>
          🔒 Secure login system<br />
          ☁️ Cloud-synced notes<br />
          ✍️ Add, edit, delete notes easily<br />
          ⚡ Built for speed and simplicity
        </p>

        <div className="mt-4">
          <h4>Total Notes You have Created: {notes.length}</h4>
          <ul className="mt-3">
            {/* {notes.map((note) => (
              <li key={note.id}>
                <strong>{note.title}</strong>: {note.description}
              </li>
            ))} */}
          </ul>
        </div>

        <p className="mt-4 fst-italic">Built with 💙 by Cheeku</p>
      </div>
    </div>
  );
}
