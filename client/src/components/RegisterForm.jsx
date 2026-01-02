import React, { useState } from 'react';
import { register } from '../services/api';
import StatusMessage from './StatusMessage.jsx';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    // Client-side validation
    if (!email || !password) {
      setStatus({
        type: 'error',
        message: 'Please fill in all fields',
      });
      return;
    }

    if (password.length < 6) {
      setStatus({
        type: 'error',
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Passwords do not match',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await register(email, password);
      setStatus({
        type: 'success',
        message: response.message || 'Registration successful! You can now login.',
      });
      
      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Auto switch to login after 2 seconds
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Create Account</h2>
      <p className="auth-subtitle">Sign up to get started</p>

      {status && (
        <StatusMessage 
          type={status.type} 
          message={status.message}
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
            placeholder="Minimum 6 characters"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            disabled={loading}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="auth-switch">
        <p>
          Already have an account?{' '}
          <button 
            type="button"
            className="link-btn" 
            onClick={onSwitchToLogin}
            disabled={loading}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;