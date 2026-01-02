import React, { useState } from 'react';
import { login } from '../services/api';
import StatusMessage from './StatusMessage.jsx';

const LoginForm = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!email || !password) {
      setStatus({
        type: 'error',
        message: 'Please enter both email and password',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await login(email, password);
      
      setStatus({
        type: 'success',
        message: response.message || 'Login successful!',
      });

      // Call parent callback with user data
      setTimeout(() => {
        onLoginSuccess(response.data);
      }, 500);

    } catch (error) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || 'Login failed. Please try again.';
      const remainingTime = errorData?.remainingTime || 0;

      // Determine status type based on HTTP status
      let statusType = 'error';
      if (error.response?.status === 403) {
        statusType = 'warning'; // User suspended
      } else if (error.response?.status === 429) {
        statusType = 'warning'; // IP blocked
      }

      setStatus({
        type: statusType,
        message: errorMessage,
        remainingTime: remainingTime,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Welcome Back</h2>
      <p className="auth-subtitle">Sign in to your account</p>

      {status && (
        <StatusMessage 
          type={status.type} 
          message={status.message}
          remainingTime={status.remainingTime}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={loading}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-switch">
        <p>
          Don't have an account?{' '}
          <button 
            type="button"
            className="link-btn" 
            onClick={onSwitchToRegister}
            disabled={loading}
          >
            Sign Up
          </button>
        </p>
      </div>

      <div className="security-notice">
        <p>
          🔒 <strong>Security Features:</strong>
        </p>
        <ul>
          <li>5 failed attempts → 15 min account suspension</li>
          <li>100 failed attempts per IP → 15 min IP block</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginForm;