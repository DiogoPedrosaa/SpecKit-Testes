import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, signOut, updateBalance } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');

  if (!user) return null;

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const handleAddBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0) {
      await updateBalance(value);
      setAmount('');
    }
  };

  return (
    <div className="tibia-container">
      <div className="tibia-header">
        <h1>Account Management</h1>
        <p>Welcome to your account page, {user.username}.</p>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div className="tibia-box" style={{ flex: 1 }}>
          <h2>Account Balance</h2>
          <p style={{ fontSize: '16px', margin: '15px 0' }}>
            Current Balance: <strong style={{ color: 'green' }}>{user.balance} TC</strong>
          </p>
          
          <form onSubmit={handleAddBalance} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
              className="tibia-input"
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="Amount in TC"
              style={{ width: '100px' }}
            />
            <button type="submit" className="tibia-button">Buy Tibia Coins</button>
          </form>
        </div>

        <div className="tibia-box" style={{ flex: 1 }}>
          <h2>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/my-characters" className="tibia-button" style={{ textAlign: 'center' }}>My Characters</Link>
            <Link to="/history" className="tibia-button" style={{ textAlign: 'center' }}>My Auction History</Link>
          </div>
        </div>
      </div>

      <div className="tibia-nav">
        <Link to="/" className="tibia-button" style={{ marginRight: '10px' }}>Back to Home</Link>
        <button onClick={handleLogout} className="tibia-button">Logout</button>
      </div>
    </div>
  );
};
