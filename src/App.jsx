import { useState, useEffect } from 'react';
import axios from 'axios';
import BookingModal from './BookingModal';
import AdminDashboard from './AdminDashboard';
import Login from './Login';
import './App.css';

const API_URL = 'https://revo-booking-api.onrender.com';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isAdminLoggedIn') === 'true');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/services`);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    if (currentView === 'home') fetchServices();
  }, [currentView]);

  useEffect(() => {
    const checkPendingBookings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/appointments`);
        const pending = response.data.filter(apt => apt.statut === 'en_attente').length;
        setPendingCount(pending);
      } catch (error) {
        console.error('Error checking pending bookings:', error);
      }
    };
    checkPendingBookings();
    const interval = setInterval(checkPendingBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id) => {
    setCurrentView('home');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAdminClick = () => {
    if (isLoggedIn) setCurrentView('admin');
    else setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  const handleBookNow = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  if (currentView === 'login') return <Login onLoginSuccess={handleLoginSuccess} onBack={() => setCurrentView('home')} />;
  if (currentView === 'admin') return <AdminDashboard onBack={handleLogout} />;

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo" onClick={() => scrollToSection('home')} style={{cursor: 'pointer'}}>REVODEV</div>
        <ul className="nav-links">
          <li><a onClick={() => scrollToSection('home')}>Home</a></li>
          <li><a onClick={() => scrollToSection('services')}>Services</a></li>
          <li><a onClick={() => scrollToSection('services')}>Booking</a></li>
          <li><a onClick={() => scrollToSection('about')}>About</a></li>
          <li><a onClick={() => scrollToSection('contact')}>Contact</a></li>
          <li>
            <a onClick={handleAdminClick} style={{ color: isLoggedIn ? '#00ed64' : '#ff4500', position: 'relative' }}>
              {isLoggedIn ? 'Admin' : 'Login'}
              {pendingCount > 0 && <span className="notification-badge">{pendingCount}</span>}
            </a>
          </li>
        </ul>
      </nav>

      <section className="hero" id="home">
        <h1>REVO<span className="accent">DEV</span><br />BOOKING SYSTEM</h1>
        <p>Professional booking platform for premium services. Choose your service and schedule your appointment in seconds.</p>
        <button className="cta-button" onClick={() => scrollToSection('services')}>GET IN TOUCH</button>
      </section>

      <section className="services-section" id="services">
        <h2 className="section-title">Our Services</h2>
        {loading ? (
          <div className="loading">Loading services...</div>
        ) : (
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={service._id} className="service-card">
                <div className="card-number">0{index + 1}</div>
                <div className="card-arrow">↗</div>
                <div className="service-image">
                  <img src={service.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop'} alt={service.nom} />
                </div>
                <div className="card-content">
                  <h2>{service.nom}</h2>
                  <p className="description">{service.description}</p>
                  <div className="service-details">
                    <span>⏱ {service.dureeMinutes} MINS</span>
                    <span className="price">R {service.prix}</span>
                  </div>
                  <button className="book-btn" onClick={() => handleBookNow(service)}>Book Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="about-section" id="about">
        <div className="about-container">
          <div className="about-content">
            <h2 className="section-title" style={{textAlign: 'left', marginBottom: '20px'}}>About RevoDev</h2>
            <p className="about-text">We are a premium digital agency dedicated to transforming businesses through innovative technology solutions.</p>
            <div className="about-stats">
              <div className="stat-box"><h3>50+</h3><p>Happy Clients</p></div>
              <div className="stat-box"><h3>100+</h3><p>Projects Done</p></div>
              <div className="stat-box"><h3>24/7</h3><p>Support</p></div>
            </div>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" alt="Team" />
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <h2 className="section-title">Contact Us</h2>
        <div className="contact-grid">
          <div className="contact-card"><div className="contact-icon">📍</div><h3>Location</h3><p>Johannesburg, South Africa</p></div>
          <div className="contact-card"><div className="contact-icon">📧</div><h3>Email</h3><p>maestroshushu@gmail.com</p></div>
          <div className="contact-card"><div className="contact-icon">📱</div><h3>Phone</h3><p>+27 81 274 1840</p></div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">REVODEV</div>
          <p className="footer-text">Premium booking solutions for modern businesses.</p>
          <div className="footer-links">
            <a onClick={() => scrollToSection('home')}>Home</a>
            <a onClick={() => scrollToSection('services')}>Services</a>
            <a onClick={() => scrollToSection('about')}>About</a>
            <a onClick={() => scrollToSection('contact')}>Contact</a>
          </div>
          <p className="footer-copy">© 2026 RevoDev. All rights reserved.</p>
        </div>
      </footer>

      {selectedService && <BookingModal service={selectedService} isOpen={isModalOpen} onClose={handleCloseModal} />}
    </div>
  );
}

export default App;