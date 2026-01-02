import React from 'react';

const Dashboard = ({ user, onLogout }) => {
  const currentTime = new Date().toLocaleString();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🎉 Welcome to Your Dashboard</h1>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <div className="card-icon">👤</div>
          <h2>Hello, {user.email}!</h2>
          <p>You have successfully logged in.</p>
          <p className="login-time">
            <small>Login time: {currentTime}</small>
          </p>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">🔒</div>
            <h3>Brute-Force Protection</h3>
            <p>
              This application implements advanced security measures to prevent
              unauthorized access through brute-force attacks.
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">👥</div>
            <h3>User-Level Security</h3>
            <p>
              After 5 failed login attempts within 5 minutes, your account will be
              temporarily suspended for 15 minutes.
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">🌐</div>
            <h3>IP-Level Protection</h3>
            <p>
              If 20 failed attempts are detected from an IP address within 5 minutes,
              all login attempts from that IP will be blocked for 15 minutes.
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">⚡</div>
            <h3>Real-Time Monitoring</h3>
            <p>
              All login attempts are monitored in real-time with sliding window
              detection to ensure maximum security.
            </p>
          </div>
        </div>

        <div className="features-section">
          <h3>✨ Application Features</h3>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Secure password hashing with bcrypt</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>MongoDB Atlas for data persistence</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Sliding window lockout mechanism</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>IP-based and user-based rate limiting</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Professional UI with React & Vite</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>RESTful API with Express.js</span>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h3>📊 System Information</h3>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-value">5</div>
              <div className="stat-label">Max User Attempts</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">20</div>
              <div className="stat-label">Max IP Attempts</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">5</div>
              <div className="stat-label">Window (minutes)</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">15</div>
              <div className="stat-label">Lockout (minutes)</div>
            </div>
          </div>
        </div>

        <div className="tech-stack">
          <h3>🛠️ Technology Stack</h3>
          <div className="tech-badges">
            <span className="tech-badge">React</span>
            <span className="tech-badge">Vite</span>
            <span className="tech-badge">Node.js</span>
            <span className="tech-badge">Express</span>
            <span className="tech-badge">MongoDB</span>
            <span className="tech-badge">bcrypt</span>
            <span className="tech-badge">Axios</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;