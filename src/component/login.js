import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/user/login', credentials);
      const token = res.data.token;

      localStorage.setItem('token', token);
      window.dispatchEvent(new Event('storage'));

      setTimeout(() => {
        alert('✅ Login successful! Welcome back to iNoteBook.');
        navigate('/');
      }, 100);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: 'linear-gradient(135deg, #141e30, #243b55)', // ✅ Different cool dark background
        fontFamily: "'Poppins', sans-serif",
        color: 'white',
      }}
    >
      <div
        className="p-4 rounded-4 shadow"
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        }}
      >
        <h3
          className="text-center mb-4"
          style={{
            color: '#00e6e6',
            fontWeight: 'bold',
            // textShadow: '0 0 8px #00ffff',
          }}
        >
          🔐 Login to <span style={{ color: '#ffc107' }}>iNoteBook</span>
        </h3>

        {error && (
          <div className="alert alert-danger text-center py-1">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light">User ID</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-0 shadow-sm"
              name="id"
              placeholder="Enter your User ID"
              value={credentials.id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Password</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-0 shadow-sm"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
              minLength={4} // ✅ Password length rule
            />
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 fw-semibold shadow-sm"
            style={{
              borderRadius: '30px',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => (e.target.style.transform = 'scale(1.02)')}
            onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
          >
            🚀 Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-light">
            Don’t have an account?{' '}
            <a href="/register" className="text-warning fw-bold">Register</a>
          </small>
        </div>
      </div>
    </div>
  );
}
