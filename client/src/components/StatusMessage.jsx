import React from 'react';

const StatusMessage = ({ type, message, remainingTime }) => {
  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className={`status-message ${type}`}>
      <div className="status-icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'warning' && '⚠'}
        {type === 'info' && 'ℹ'}
      </div>
      <div className="status-content">
        <p className="status-text">{message}</p>
        {remainingTime > 0 && (
          <p className="status-time">
            Time remaining: <strong>{formatTime(remainingTime)}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default StatusMessage;