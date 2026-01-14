import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'guest' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Hits your registerUser controller
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // Save the token and user info for the middleware to use
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert("Registration Successful! Welcome to LuxeAI.");
      navigate('/'); // Redirect to the Dashboard shown in your screenshot
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: '#1a365d', textAlign: 'center', marginBottom: '10px' }}>Join LuxeAI</h2>
        <p style={{ textAlign: 'center', color: '#718096', marginBottom: '20px' }}>Create your enterprise staff or guest account</p>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={inputGroup}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" name="name" required style={inputStyle} placeholder="John Doe" onChange={handleChange} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Email Address</label>
            <input type="email" name="email" required style={inputStyle} placeholder="john@enterprise.com" onChange={handleChange} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Password</label>
            <input type="password" name="password" required style={inputStyle} placeholder="••••••••" onChange={handleChange} />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>System Role</label>
            <select name="role" style={inputStyle} onChange={handleChange}>
              <option value="guest">Guest (View Only)</option>
              <option value="receptionist">Receptionist (Manage Bookings)</option>
              <option value="admin">Admin (AI & Market Control)</option>
            </select>
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#2b6cb0', fontWeight: 'bold' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '20px'
};

const cardStyle: React.CSSProperties = {
  background: 'white', padding: '40px', borderRadius: '16px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px'
};

const inputGroup: React.CSSProperties = { marginBottom: '15px' };

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: '#4a5568'
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px', borderRadius: '8px',
  border: '1px solid #e2e8f0', boxSizing: 'border-box', fontSize: '16px'
};

const buttonStyle: React.CSSProperties = {
  width: '100%', padding: '14px', backgroundColor: '#1a365d',
  color: 'white', border: 'none', borderRadius: '8px',
  fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: 'background 0.2s'
};

const errorStyle: React.CSSProperties = {
  backgroundColor: '#fff5f5', color: '#c53030', padding: '10px',
  borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '14px'
};

export default Register;