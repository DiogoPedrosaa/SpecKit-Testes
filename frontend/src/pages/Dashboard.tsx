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
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user.username}!</p>
      <p>Current Balance: {user.balance}</p>
      
      <form onSubmit={handleAddBalance}>
        <input 
          type="number" 
          value={amount} 
          onChange={e => setAmount(e.target.value)} 
          placeholder="Amount"
        />
        <button type="submit">Add Balance</button>
      </form>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <Link to="/my-characters">My Characters</Link>
        <Link to="/">Home (All Characters)</Link>
        <Link to="/history">My History</Link>
      </div>

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>Logout</button>
    </div>
  );
};
