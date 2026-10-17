import { useState } from 'react';
import axios from 'axios';
import './Login.css';

const API_URL = 'https://revo-booking-api.onrender.com';

function Login({ onLoginSuccess, onBack }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, { password: password });
      if (response.data.success) {
        localStorage.setItem('isAdminLoggedIn', 'true');
        onLoginSuccess();
      }
    } catch (err) {
      setError('Invalid password. Access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-box">
        <button className="login-back-btn" onClick={onBack}>← Back</button>
        <div className="login-header">
          <h2>Admin Access</h2>
          <p>Enter your secret key to access the dashboard</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoFocus />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-submit-btn" disabled={isLoading}>{isLoading ? 'Verifying...' : 'Unlock Dashboard'}</button>
        </form>
      </div>
    </div>
  );
}

export default Login;