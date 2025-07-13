import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import NoteContext from './noteContext';

export default function NoteState(props) {
  const [notes, setNotes] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token')); // 👈 track token

  const getAuthHeaders = () => {
    return {
      headers: {
        'auth-token': token,
        'Content-Type': 'application/json'
      }
    };
  };

  const fetchNotes = useCallback(async () => {
    if (!token) {
      console.warn('⚠️ No token found. Skipping fetchNotes.');
      return;
    }
    try {
      const res = await axios.get('http://localhost:5000/api/notes/fetchall', getAuthHeaders());
      setNotes(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch notes:', err.response?.data || err.message);
    }
  }, [token]); // 👈 watch token

  const addNote = async (title, description) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/notes/createnotes',
        { title, description },
        getAuthHeaders()
      );
      setNotes(prevNotes => [...prevNotes, res.data]);
    } catch (err) {
      console.error('❌ Failed to add note:', err.response?.data || err.message);
    }
  };

  const deleteNote = async (_id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/delete/${_id}`, getAuthHeaders());
      setNotes(prevNotes => prevNotes.filter(note => note._id !== _id));
    } catch (err) {
      console.error('❌ Failed to delete note:', err.response?.data || err.message);
    }
  };

  const updateNote = async (_id, title, description) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/notes/updatenote/${_id}`,
        { title, description },
        getAuthHeaders()
      );
      setNotes(prevNotes =>
        prevNotes.map(note => (note._id === _id ? res.data : note))
      );
    } catch (err) {
      console.error('❌ Failed to update note:', err.response?.data || err.message);
    }
  };

  // ✅ Re-run when token changes
  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token, fetchNotes]);

  // ✅ Optional: Listen to storage change in other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, updateNote }}>
      {props.children}
    </NoteContext.Provider>
  );
}
