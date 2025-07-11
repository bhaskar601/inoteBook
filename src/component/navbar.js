// Navbar.js

import React, { Component } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Functional wrapper to pass location as prop
function NavbarWithLocation() {
  const location = useLocation();
  return <Navbar location={location} />;
}

class Navbar extends Component {
  render() {
    const { location } = this.props;
    
    return (
      <nav className="navbar navbar-expand-lg" style={{ background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)' }}>
        <div className="container-fluid">
          <Link className="navbar-brand text-white fw-bold" to="/">📝 iNotebook</Link>

          <button
            className="navbar-toggler bg-light"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link text-light ${location.pathname === '/' ? 'active fw-bold' : ''}`} to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link text-light ${location.pathname === '/About' ? 'active fw-bold' : ''}`} to="/About">About</Link>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-light"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  More
                </a>
                <ul className="dropdown-menu dropdown-menu-dark bg-gradient" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="#">Action</a></li>
                  <li><a className="dropdown-item" href="#">Another action</a></li>
                  <li><hr className="dropdown-divider" /></li>
                </ul>
              </li>
            </ul>

            <form className="d-flex" role="search">
              <input
                className="form-control me-2 border-0 shadow-sm"
                type="search"
                placeholder="Search notes..."
                aria-label="Search"
              />
              <button className="btn btn-outline-warning text-white" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
    );
  }
}

// Export the functional wrapper (with location)
export default NavbarWithLocation;
