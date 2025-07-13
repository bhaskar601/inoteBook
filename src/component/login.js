import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import register from './register';

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

    localStorage.setItem('token', token); // ✅ Save token

    // ✅ Show login success alert
    alert('✅ Login successful! Welcome back to iNoteBook.');

    navigate('/'); // ✅ Go to home to view notes
  } catch (err) {
    setError(err.response?.data?.error || 'Invalid credentials');
  }
};


  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="p-4 rounded-4 shadow"
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h3 className="text-center text-white mb-4">
          🔐 Login to <span className="text-warning fw-bold">iNoteBook</span>
        </h3>

        {error && (
          <div className="alert alert-danger text-center py-1">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white">User ID</label>
            <input
              type="text"
              className="form-control shadow-sm"
              name="id"
              placeholder="Enter your User ID"
              value={credentials.id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Password</label>
            <input
              type="password"
              className="form-control shadow-sm"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 fw-semibold shadow-sm"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-light">
            Don’t have an account? <a href="/register" className="text-warning fw-bold">Register</a>
          </small>
        </div>
      </div>
    </div>
  );
}
