import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Save the enterprise credentials
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      alert("Access Granted. Redirecting to Dashboard...");
      window.location.href = '/'; // Go back to dashboard
    } catch (err: any) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div style={authContainerStyle}>
      <form onSubmit={handleLogin} style={authFormStyle}>
        <h2 style={{ color: '#1a365d', textAlign: 'center' }}>Enterprise Login</h2>
        <input 
          type="email" 
          placeholder="Corporate Email" 
          style={inputStyle} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          style={inputStyle} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" style={loginBtnStyle}>Authorize Access</button>
        <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '15px' }}>
          New Staff? <a href="/register" style={{ color: '#2b6cb0' }}>Register here</a>
        </p>
      </form>
    </div>
  );
};

// --- AUTH STYLES ---
const authContainerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' };
const authFormStyle: React.CSSProperties = { background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '380px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' };
const loginBtnStyle: React.CSSProperties = { width: '100%', padding: '12px', backgroundColor: '#1a365d', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };

export default Login;