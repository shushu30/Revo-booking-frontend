import { useState } from 'react';
import axios from 'axios';
import './BookingModal.css';

const API_URL = 'https://revo-booking-api.onrender.com';

function BookingModal({ service, isOpen, onClose }) {
  const [formData, setFormData] = useState({ nomClient: '', telephone: '', email: '', date: '', heure: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const bookingData = { ...formData, service: service._id, statut: 'en_attente' };
      await axios.post(`${API_URL}/api/appointments`, bookingData);
      setSuccessMessage('✅ Booking confirmed! We will contact you shortly.');
      setFormData({ nomClient: '', telephone: '', email: '', date: '', heure: '', notes: '' });
      setTimeout(() => { setSuccessMessage(''); onClose(); }, 2500);
    } catch (error) {
      console.error('Booking error:', error);
      alert('❌ Error: ' + (error.response?.data?.message || 'Something went wrong'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-header">
          <h2>Book Your Appointment</h2>
          <p className="selected-service">Selected: <span className="accent">{service?.nom}</span> • R {service?.prix}</p>
        </div>
        {successMessage ? (
          <div className="success-message">{successMessage}</div>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="nomClient" value={formData.nomClient} onChange={handleChange} required placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required placeholder="+27 82 123 4567" />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input type="time" name="heure" value={formData.heure} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any special requests..." rows="3" />
            </div>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Processing...' : 'Confirm Booking'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default BookingModal;