import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="tibia-container" style={{ width: '400px' }}>
      <div className="tibia-header">
        <h1>Login</h1>
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      <div className="tibia-box">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Username</label>
            <input 
              className="tibia-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Password</label>
            <input 
              className="tibia-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button type="submit" className="tibia-button">Login</button>
          </div>
        </form>
      </div>

      <div className="tibia-nav">
        <p>Don't have an account? <Link to="/register" className="tibia-link">Register here</Link></p>
        <Link to="/" className="tibia-link">Back to Home</Link>
      </div>
    </div>
  );
};
