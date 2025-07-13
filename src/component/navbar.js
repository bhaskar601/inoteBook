// Navbar.js

import { Component } from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavbarWithLocation() {
  const location = useLocation();
  return <Navbar location={location} />;
}

class Navbar extends Component {
  render() {
    const { location } = this.props;

    return (
      <nav
        className="navbar navbar-expand-lg"
        style={{ background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)' }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand text-white fw-bold" to="/">📝 iNoteBook</Link>

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
                {/* <Link
                  className={`nav-link text-light ${location.pathname === '/Home' ? 'active fw-bold' : ''}`}
                  to="/"
                >
                  Home
                </Link> */}
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link text-light ${location.pathname === '/about' ? 'active fw-bold' : ''}`}
                  to="/about"
                >
                  About
                </Link>
              </li>
            </ul>

            {/* ✅ Login / Signup Buttons */}
            <div className="d-flex gap-2">
              <Link className="btn btn-warning text-dark fw-semibold" to="/login">Login</Link>
              <Link className="btn btn-warning text-dark fw-semibold" to="/register">Register</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavbarWithLocation;
