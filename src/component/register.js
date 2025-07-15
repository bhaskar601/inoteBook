import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [user, setUser] = useState({ name: '', id: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/user/createuser', user);
      alert('🎉 Registration successful! Welcome to iNoteBook.');
      localStorage.setItem('token', res.data.token);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
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
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 20px rgba(255,255,255,0.05)',
        }}
      >
        <h3
          className="text-center mb-4"
          style={{
            color: '#00ffff',
            fontWeight: 'bold',
            // textShadow: '0 0 8px #00ffff',
          }}
        >
          📝 Register to <span style={{ color: '#ffc107' }}>iNoteBook</span>
        </h3>

        {error && <div className="alert alert-danger text-center py-1">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light">Full Name</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-0 shadow-sm"
              name="name"
              placeholder="Enter your name"
              value={user.name}
              onChange={handleChange}
              required
              minLength={3}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">User ID</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-0 shadow-sm"
              name="id"
              placeholder="Choose a user ID"
              value={user.id}
              onChange={handleChange}
              required
              minLength={4}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Password</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-0 shadow-sm"
              name="password"
              placeholder="Create a strong password"
              value={user.password}
              onChange={handleChange}
              required
              minLength={4}
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
            🚀 Register
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-light">
            Already have an account?{' '}
            <a href="/login" className="text-warning fw-bold">Login</a>
          </small>
        </div>
      </div>
    </div>
  );
}
