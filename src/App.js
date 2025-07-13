import 'bootstrap/dist/css/bootstrap.min.css';
import { Component } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from './component/About'; // example route component
import Home from './component/Home'; // another route (create if not exist)
import Login from './component/login';
import Navbar from './component/navbar';
import NoteStatee from './context/NoteState'; // corrected name
import Register from './component/register';
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </Router>
      </NoteStatee>
    );
  }
}
