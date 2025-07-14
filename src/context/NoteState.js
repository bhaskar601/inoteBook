import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import NoteContext from './noteContext';

export default function NoteState(props) {
  const [notes, setNotes] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const getAuthHeaders = () => ({
    headers: {
      'auth-token': token,
      'Content-Type': 'application/json'
    }
  });

  const fetchNotes = useCallback(async () => {
    if (!token) {
      setNotes([]); // ✅ Clear notes if not logged in
      console.warn('⚠️ No token found. Skipping fetchNotes.');
      return;
    }
    try {
      const res = await axios.get('http://localhost:5000/api/notes/fetchall', getAuthHeaders());
      setNotes(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch notes:', err.response?.data || err.message);
    }
  }, [token]);

  const addNote = async (title, description) => {
    try {
      await axios.post(
        'http://localhost:5000/api/notes/createnotes',
        { title, description },
        getAuthHeaders()
      );
      await fetchNotes(); // ✅ Always fetch latest from backend
    } catch (err) {
      console.error('❌ Failed to add note:', err.response?.data || err.message);
    }
  };

  const deleteNote = async (_id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/delete/${_id}`, getAuthHeaders());
      await fetchNotes();
    } catch (err) {
      console.error('❌ Failed to delete note:', err.response?.data || err.message);
    }
  };

  const updateNote = async (_id, title, description) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notes/updatenote/${_id}`,
        { title, description },
        getAuthHeaders()
      );
      await fetchNotes();
    } catch (err) {
      console.error('❌ Failed to update note:', err.response?.data || err.message);
    }
  };

  // Fetch notes when token changes
  useEffect(() => {
    fetchNotes();
  }, [token, fetchNotes]);

  // Listen to token changes across tabs or during logout
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      setToken(newToken);
      if (!newToken) setNotes([]); // ✅ Real-time logout handling
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
