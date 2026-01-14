import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Bed, Wifi, Users, TrendingUp, LogOut, Settings, Calendar, ShieldCheck, MapPin, Star, X } from 'lucide-react';

interface Room {
  _id: string;
  name: string;
  basePrice: number;
  currentPrice: number;
  demandScore: number;
}

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDemandSpike = async () => {
    if (!token) return alert("Admin Access Required");
    setUpdating(true);
    try {
      await axios.post('http://localhost:5000/api/rooms/simulate-spike', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchRooms();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || "Action failed"}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedRoom) return;
    setIsBooking(true);
    try {
      await axios.post('http://localhost:5000/api/rooms/book', {
        roomId: selectedRoom._id,
        checkIn: new Date(),
        checkOut: new Date(Date.now() + 86400000), // Default 1 night
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`🎉 Success! Your stay at ${selectedRoom.name} is secured.`);
      setSelectedRoom(null);
    } catch (error) {
      alert("Booking failed. Room may have been taken.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <div style={loadingOverlay}>Initializing LuxeAI Premium Experience...</div>;

  return (
    <div style={appContainer}>
      {/* --- ENTERPRISE SIDEBAR --- */}
      <nav style={sidebarStyle}>
        <div style={logoSection}>
          <div style={logoIcon}>LX</div>
          <h2 style={logoText}>LuxeAI</h2>
        </div>
        
        <div style={navLinks}>
          <button style={activeNavLink}><Calendar size={18} /> Available Suites</button>
          <button style={navLink}><Star size={18} /> Membership</button>
          {user.role === 'admin' && (
            <Link to="/admin" style={navLink}><Settings size={18} /> Admin Console</Link>
          )}
        </div>

        <div style={userProfile}>
          <div style={userAvatar}>{user.name?.charAt(0) || 'G'}</div>
          <div style={userInfo}>
            <p style={userName}>{user.name || 'Guest'}</p>
            <p style={userRole}>{user.role || 'Standard Access'}</p>
          </div>
          {token && <LogOut size={18} onClick={() => {localStorage.clear(); window.location.reload();}} style={{cursor:'pointer', color: '#94a3b8'}} />}
        </div>
      </nav>

      {/* --- MAIN DASHBOARD --- */}
      <main style={mainContent}>
        <header style={headerStyle}>
          <div>
            <div style={{display:'flex', alignItems:'center', gap: '8px', color: '#3b82f6', fontWeight: '600', fontSize: '14px'}}>
               <MapPin size={14}/> DUBAI, UAE
            </div>
            <h1 style={greeting}>Discover Your Sanctuary</h1>
            <p style={subGreeting}>AI-Powered Dynamic Pricing for the Modern Traveler</p>
          </div>
          
          <div style={headerActions}>
            {(user.role === 'admin' || user.role === 'receptionist') && (
              <button onClick={handleDemandSpike} disabled={updating} style={spikeBtn}>
                {updating ? 'Processing...' : <><TrendingUp size={18} /> Simulate Market Spike</>}
              </button>
            )}
            {!token && <button onClick={() => navigate('/login')} style={loginBtn}>Sign In</button>}
          </div>
        </header>

        {/* --- LUXURY ROOM LIST --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '100px' }}>
          {rooms.map((room, index) => (
            <div key={room._id} className="wide-card-hover" style={wideLuxuryCard}>
              <div style={{
                width: '450px',
                backgroundImage: `url('https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                {room.demandScore > 0.8 && <div style={trendingLabel}>🔥 HIGH DEMAND</div>}
              </div>

              <div style={cardBody}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={categoryLabel}>Premium Suite • {index % 2 === 0 ? 'City View' : 'Ocean Front'}</span>
                    <h2 style={hugeTitle}>{room.name}</h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={priceLabel}>Rate from</p>
                    <h2 style={hugePrice}>${room.currentPrice}<span style={{fontSize: '16px', color: '#94a3b8'}}> / night</span></h2>
                  </div>
                </div>

                <p style={descriptionText}>
                  Experience the pinnacle of luxury in our {room.name}. Every detail is curated for comfort, 
                  featuring Italian marble and 24/7 AI concierge support.
                </p>

                <div style={featureRow}>
                  <span style={feature}><Bed size={18}/> King Bed</span>
                  <span style={feature}><Wifi size={18}/> 1Gbps WiFi</span>
                  <span style={feature}><Users size={18}/> 2 Adults</span>
                  <span style={feature}><ShieldCheck size={18}/> Zero-Deposit</span>
                </div>

                <div style={cardFooter}>
                  <div style={aiInsights}>
                    <TrendingUp size={16} color="#3b82f6" />
                    <span>AI Insights: Current rate optimized for { (room.demandScore * 100).toFixed(0) }% market demand.</span>
                  </div>
                  <button style={bookBtnLarge} onClick={() => setSelectedRoom(room)}>
                    Reserve Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- BOOKING MODAL --- */}
        {selectedRoom && (
          <div style={modalOverlay}>
            <div style={modalContent}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                <h2 style={hugeTitle}>Confirm Stay</h2>
                <X size={24} onClick={() => setSelectedRoom(null)} style={{cursor: 'pointer'}} />
              </div>
              
              <div style={priceBreakdown}>
                 <div style={priceRow}><span>{selectedRoom.name}</span> <span>${selectedRoom.basePrice}</span></div>
                 <div style={priceRow}><span style={{color: '#3b82f6'}}>AI Surge Adjustment</span> <span>+${selectedRoom.currentPrice - selectedRoom.basePrice}</span></div>
                 <hr style={{margin: '15px 0', borderColor: '#e2e8f0'}} />
                 <div style={{...priceRow, fontWeight: '800', fontSize: '20px'}}><span>Total</span> <span>${selectedRoom.currentPrice}</span></div>
              </div>

              <div style={{display: 'flex', gap: '15px', marginTop: '30px'}}>
                 <button onClick={() => setSelectedRoom(null)} style={cancelBtn}>Go Back</button>
                 <button onClick={handleConfirmBooking} disabled={isBooking} style={confirmBtn}>
                   {isBooking ? 'Securing...' : 'Secure Reservation'}
                 </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- STYLES OBJECT ---
const appContainer: React.CSSProperties = { display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: "'Inter', sans-serif" };
const sidebarStyle: React.CSSProperties = { width: '300px', backgroundColor: '#0f172a', padding: '40px 30px', display: 'flex', flexDirection: 'column', color: 'white', position: 'fixed', height: '100vh', zIndex: 10 };
const logoSection: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '60px' };
const logoIcon: React.CSSProperties = { width: '45px', height: '45px', backgroundColor: '#3b82f6', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '20px' };
const logoText: React.CSSProperties = { fontSize: '24px', fontWeight: 'bold', margin: 0 };
const navLinks: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' };
const navLink: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', color: '#94a3b8', textDecoration: 'none', borderRadius: '10px' };
const activeNavLink: React.CSSProperties = { ...navLink, backgroundColor: '#1e293b', color: 'white', border: 'none', textAlign: 'left', cursor: 'pointer', width: '100%' };
const mainContent: React.CSSProperties = { flex: 1, marginLeft: '300px', padding: '60px' };
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' };
const headerActions: React.CSSProperties = { display: 'flex', gap: '20px' };
const greeting: React.CSSProperties = { fontSize: '36px', fontWeight: '800', color: '#1e293b', margin: '10px 0 0 0' };
const subGreeting: React.CSSProperties = { color: '#64748b', fontSize: '18px', margin: '8px 0 0 0' };
const wideLuxuryCard: React.CSSProperties = { display: 'flex', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', overflow: 'hidden', minHeight: '380px', transition: '0.3s' };
const cardBody: React.CSSProperties = { flex: 1, padding: '40px', display: 'flex', flexDirection: 'column' };
const hugeTitle: React.CSSProperties = { fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '0' };
const hugePrice: React.CSSProperties = { fontSize: '36px', color: '#0f172a', fontWeight: '900', margin: 0 };
const categoryLabel: React.CSSProperties = { textTransform: 'uppercase', letterSpacing: '2px', fontSize: '13px', color: '#3b82f6', fontWeight: 'bold', marginBottom: '5px', display: 'block' };
const priceLabel: React.CSSProperties = { fontSize: '12px', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' };
const descriptionText: React.CSSProperties = { color: '#64748b', lineHeight: '1.8', fontSize: '16px', margin: '20px 0' };
const featureRow: React.CSSProperties = { display: 'flex', gap: '25px', marginBottom: '30px' };
const feature: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#475569', fontWeight: '500' };
const cardFooter: React.CSSProperties = { marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '30px', borderTop: '1px solid #f1f5f9' };
const aiInsights: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#eff6ff', padding: '12px 20px', borderRadius: '12px', color: '#1e40af', fontSize: '14px', fontWeight: '500' };
const bookBtnLarge: React.CSSProperties = { padding: '16px 45px', backgroundColor: '#0f172a', color: 'white', borderRadius: '14px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' };
const spikeBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 25px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold' };
const loginBtn: React.CSSProperties = { padding: '16px 40px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold' };
const trendingLabel: React.CSSProperties = { position: 'absolute', top: '20px', left: '20px', backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', letterSpacing: '1px' };
const loadingOverlay: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px', fontWeight: '600', color: '#0f172a' };
const userProfile: React.CSSProperties = { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '15px', padding: '24px', backgroundColor: '#1e293b', borderRadius: '16px' };
const userAvatar: React.CSSProperties = { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: 'white' };
const userInfo: React.CSSProperties = { flex: 1 };
const userName: React.CSSProperties = { fontSize: '15px', fontWeight: 'bold', margin: 0 };
const userRole: React.CSSProperties = { fontSize: '12px', color: '#94a3b8', margin: 0 };
const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(10px)' };
const modalContent: React.CSSProperties = { backgroundColor: 'white', padding: '40px', borderRadius: '32px', width: '550px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' };
const priceBreakdown: React.CSSProperties = { backgroundColor: '#f8fafc', padding: '25px', borderRadius: '20px', marginTop: '20px' };
const priceRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', margin: '10px 0', color: '#1e293b', fontSize: '16px' };
const confirmBtn: React.CSSProperties = { flex: 1, padding: '18px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' };
const cancelBtn: React.CSSProperties = { flex: 1, padding: '18px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' };

export default App;