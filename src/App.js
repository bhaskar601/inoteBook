import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/navbar';
import NoteStatee from './context/NoteState'; // corrected name
import About from './component/About';      // example route component
import Home from './component/Home';        // another route (create if not exist)

export default class App extends Component {
  render() {
    return (
      <NoteStatee>
        <Router>
          <Navbar />
          <div className="container my-3">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </Router>
      </NoteStatee>
    );
  }
}
