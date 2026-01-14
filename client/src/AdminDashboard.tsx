import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Retrieve token and user info for the request
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sending the room data with the Authorization header
      await axios.post('http://localhost:5000/api/rooms', 
        { name, basePrice: Number(basePrice) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✨ New Room Successfully Added to LuxeAI!");
      navigate('/'); // Redirect back to main dashboard
    } catch (error: any) {
      console.error("Failed to create room:", error);
      alert(error.response?.data?.message || "Error creating room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar / Navigation */}
      <div style={sidebarStyle}>
        <h2 style={{ color: 'white' }}>LuxeAI Admin</h2>
        <p style={{ color: '#a0aec0' }}>Logged in as: {user.name}</p>
        <hr style={{ borderColor: '#2d3748' }} />
        <button onClick={() => navigate('/')} style={navButtonStyle}>🏠 Main Dashboard</button>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={logoutButtonStyle}>🚪 Logout</button>
      </div>

      {/* Main Content Area */}
      <div style={contentStyle}>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#1a365d' }}>Inventory Management</h1>
          <p>Add new high-end suites to the LuxeAI marketplace.</p>
        </header>

        <div style={formCardStyle}>
          <h3>Add New Room</h3>
          <form onSubmit={handleCreateRoom}>
            <div style={inputGroup}>
              <label style={labelStyle}>Room Name / Suite Type</label>
              <input 
                type="text" 
                placeholder="e.g., Presidential Sky Suite" 
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Starting Base Price ($)</label>
              <input 
                type="number" 
                placeholder="1200" 
                style={inputStyle}
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} style={submitButtonStyle}>
              {loading ? 'Adding to Inventory...' : 'Confirm & Publish Room'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle: React.CSSProperties = { display: 'flex', minHeight: '100vh', backgroundColor: '#f7fafc' };
const sidebarStyle: React.CSSProperties = { width: '260px', backgroundColor: '#1a365d', padding: '30px', color: 'white' };
const contentStyle: React.CSSProperties = { flex: 1, padding: '50px' };
const formCardStyle: React.CSSProperties = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', maxWidth: '600px' };
const inputGroup: React.CSSProperties = { marginBottom: '20px' };
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a5568' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' };
const submitButtonStyle: React.CSSProperties = { width: '100%', padding: '14px', backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const navButtonStyle: React.CSSProperties = { width: '100%', padding: '10px', backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '6px', cursor: 'pointer', marginBottom: '10px' };
const logoutButtonStyle: React.CSSProperties = { width: '100%', padding: '10px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };

export default AdminDashboard;