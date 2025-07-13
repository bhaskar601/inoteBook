import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [user, setUser] = useState({
    name: '',
    id: '',
    password: ''
  });

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
    console.log('✅ Registered:', res.data);

    // ✅ Show success alert
    alert('🎉 Registration successful! Welcome to iNoteBook.');

    // Save token and navigate
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
        background: 'linear-gradient(to right, #1d2b64, #f8cdda)',
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
          📝 Register to <span className="text-warning fw-bold">iNoteBook</span>
        </h3>

        {error && (
          <div className="alert alert-danger text-center py-1">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white">Full Name</label>
            <input
              type="text"
              className="form-control shadow-sm"
              name="name"
              placeholder="Enter your name"
              value={user.name}
              onChange={handleChange}
              required
              minLength={3}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white">User ID</label>
            <input
              type="text"
              className="form-control shadow-sm"
              name="id"
              placeholder="Choose a user ID"
              value={user.id}
              onChange={handleChange}
              required
              minLength={3}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Password</label>
            <input
              type="password"
              className="form-control shadow-sm"
              name="password"
              placeholder="Create a strong password"
              value={user.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 fw-semibold shadow-sm"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-light">
            Already have an account?{' '}
            <a href="/Login" className="text-warning fw-bold">Login</a>
          </small>
        </div>
      </div>
    </div>
  );
}
