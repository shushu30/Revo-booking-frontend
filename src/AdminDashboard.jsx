import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = 'https://revo-booking-api.onrender.com';

function AdminDashboard({ onBack }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0, totalRevenue: 0 });

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/appointments`);
      const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAppointments(sorted);
      calculateStats(sorted);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointments) => {
    const total = appointments.length;
    const pending = appointments.filter(apt => apt.statut === 'en_attente').length;
    const confirmed = appointments.filter(apt => apt.statut === 'confirme').length;
    const cancelled = appointments.filter(apt => apt.statut === 'annule').length;
    const totalRevenue = appointments.filter(apt => apt.statut === 'confirme').reduce((sum, apt) => sum + (apt.service?.prix || 0), 0);
    setStats({ total, pending, confirmed, cancelled, totalRevenue });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/appointments/${id}`, { statut: newStatus });
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirme': return 'status-confirmed';
      case 'annule': return 'status-cancelled';
      case 'termine': return 'status-completed';
      default: return 'status-pending';
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button className="back-btn" onClick={onBack}>← Back to Home</button>
        <h2>Admin Dashboard</h2>
        <p>Manage and track all customer bookings</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div>
          <div className="stat-info"><h3>{stats.total}</h3><p>Total Bookings</p></div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffa500" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div className="stat-info"><h3>{stats.pending}</h3><p>Pending</p></div>
        </div>
        <div className="stat-card stat-confirmed">
          <div className="stat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ed64" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
          <div className="stat-info"><h3>{stats.confirmed}</h3><p>Confirmed</p></div>
        </div>
        <div className="stat-card stat-cancelled">
          <div className="stat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff4500" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
          <div className="stat-info"><h3>{stats.cancelled}</h3><p>Cancelled</p></div>
        </div>
        <div className="stat-card stat-revenue">
          <div className="stat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ed64" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
          <div className="stat-info"><h3>R {stats.totalRevenue}</h3><p>Total Revenue</p></div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="appointments-table">
          <thead>
            <tr><th>Date & Time</th><th>Client</th><th>Service</th><th>Price</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan="6" className="empty-state">No appointments found</td></tr>
            ) : (
              appointments.map((apt) => (
                <tr key={apt._id}>
                  <td><div className="date-cell">{new Date(apt.date).toLocaleDateString()}<span className="time">{apt.heure}</span></div></td>
                  <td><div className="client-cell"><strong>{apt.nomClient}</strong><span>{apt.telephone}</span><span className="email">{apt.email || 'No email'}</span></div></td>
                  <td><div className="service-cell">{apt.service ? apt.service.nom : 'Unknown Service'}<span className="notes">{apt.notes || 'No notes'}</span></div></td>
                  <td className="price-cell">R {apt.service ? apt.service.prix : 0}</td>
                  <td><span className={`status-badge ${getStatusColor(apt.statut)}`}>{apt.statut.replace('_', ' ').toUpperCase()}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn confirm" onClick={() => handleStatusChange(apt._id, 'confirme')} title="Confirm">✓</button>
                      <button className="action-btn cancel" onClick={() => handleStatusChange(apt._id, 'annule')} title="Cancel">✕</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;