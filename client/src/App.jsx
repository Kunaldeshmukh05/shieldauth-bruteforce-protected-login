import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import Dashboard from './components/DashBoard.jsx';
import './styles/App.css';
import './styles/Auth.css';
import './styles/Dashboard.css';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard'
  const [user, setUser] = useState(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentView('dashboard');
    }
  }, []);
    

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentView('login');
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  return (
    <div className="app">
      {currentView === 'dashboard' ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <div className="auth-container">
          <div className="auth-box">
            <div className="auth-header">
              <div className="logo">
                <div className="logo-icon">🔐</div>
                <h1>SecureLogin</h1>
              </div>
              <p className="tagline">Brute-Force Protected Authentication</p>
            </div>

            {currentView === 'login' ? (
              <LoginForm
                onLoginSuccess={handleLoginSuccess}
                onSwitchToRegister={handleSwitchToRegister}
              />
            ) : (
              <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
            )}
          </div>

          <footer className="auth-footer">
            <p>
              Built with <span className="heart">❤️</span> for secure authentication
            </p>
            <p className="tech-info">
              React • Node.js • Express • MongoDB
            </p>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;