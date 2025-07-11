// src/context/NoteState.js

import { useState, useEffect } from 'react';
import NoteContext from './noteContext';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/notes';

export default function NoteState(props) {
  const [notes, setNotes] = useState([]);

  // Get auth headers
  const getAuthHeaders = () => ({
    headers: {
      'auth-token': localStorage.getItem('token')
    }
  });

  // ✅ Fetch all notes from backend
  const fetchNotes = async () => {
    try {
      const res = await axios.get(API_BASE, getAuthHeaders());
      setNotes(res.data);
    } catch (err) {
      console.error('❌ Error fetching notes:', err);
    }
  };

  // ✅ Add note to backend
  const addNote = async (title, description) => {
    try {
      const res = await axios.post(API_BASE, { title, description }, getAuthHeaders());
      setNotes(prevNotes => [...prevNotes, res.data]); // append new note
    } catch (err) {
      console.error('❌ Error adding note:', err);
    }
  };

  // ✅ Delete note from backend
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`, getAuthHeaders());
      setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
    } catch (err) {
      console.error('❌ Error deleting note:', err);
    }
  };

  // ✅ Update note in backend
  const updateNote = async (id, title, description) => {
    try {
      const res = await axios.put(`${API_BASE}/${id}`, { title, description }, getAuthHeaders());
      setNotes(prevNotes =>
        prevNotes.map(note => (note._id === id ? res.data : note))
      );
    } catch (err) {
      console.error('❌ Error updating note:', err);
    }
  };

  // ✅ Automatically fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, updateNote }}>
      {props.children}
    </NoteContext.Provider>
  );
}
