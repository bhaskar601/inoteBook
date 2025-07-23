import { Component } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function NavbarWithLocation() {
  const location = useLocation();
  const navigate = useNavigate();

  return <Navbar location={location} navigate={navigate} />;
}

class Navbar extends Component {
handleLogout = async () => {
  const confirmLogout = window.confirm('Are you sure you want to logout?');
  if (!confirmLogout) return;

  const token = localStorage.getItem('token');

  try {
    const response = await fetch('https://backend-inotebook.vercel.app/api/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
      },
    });

    if (response.ok) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('storage'));
      alert('🚪 Logged out successfully.');
      this.props.navigate('/login'); // ✅ clearer flow
    } else {
      const resJson = await response.json();
      alert(resJson.error || 'Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
    alert('Logout failed due to server error');
  }
};



  render() {
    const { location } = this.props;
    const isLoggedIn = !!localStorage.getItem('token');

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
                {/* Add Home link if needed */}
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

            {/* ✅ Login / Logout Buttons */}
            <div className="d-flex gap-2">
              {isLoggedIn ? (
                <button className="btn btn-danger fw-semibold" onClick={this.handleLogout}>
                  Logout
                </button>
              ) : (
                <>
                  <Link className="btn btn-warning text-dark fw-semibold" to="/login">Login</Link>
                  <Link className="btn btn-warning text-dark fw-semibold" to="/register">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavbarWithLocation;
