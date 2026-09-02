import React, { useState } from 'react';
import { characterService } from '../../services/characters';
import { useNavigate, Link } from 'react-router-dom';

export const CharacterCreate: React.FC = () => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<number>(1);
  const [vocation, setVocation] = useState('Knight');
  const [gender, setGender] = useState('Male');
  const [world, setWorld] = useState('Antica');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await characterService.createCharacter({
        name,
        level,
        vocation,
        gender,
        world
      });
      navigate('/my-characters');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create character');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tibia-container" style={{ width: '500px' }}>
      <div className="tibia-header">
        <h1>Add Character</h1>
      </div>
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      <div className="tibia-box">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Name:</label>
            <input 
              className="tibia-input"
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Level:</label>
            <input 
              className="tibia-input"
              type="number" 
              value={level} 
              onChange={(e) => setLevel(Number(e.target.value))} 
              min="1" 
              required 
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Vocation:</label>
            <select className="tibia-input" value={vocation} onChange={(e) => setVocation(e.target.value)} style={{ width: '100%', boxSizing: 'border-box' }}>
              <option value="Knight">Knight</option>
              <option value="Paladin">Paladin</option>
              <option value="Sorcerer">Sorcerer</option>
              <option value="Druid">Druid</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Gender:</label>
            <select className="tibia-input" value={gender} onChange={(e) => setGender(e.target.value)} style={{ width: '100%', boxSizing: 'border-box' }}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>World:</label>
            <input 
              className="tibia-input"
              type="text" 
              value={world} 
              onChange={(e) => setWorld(e.target.value)} 
              required 
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button type="submit" className="tibia-button" disabled={loading}>
              {loading ? 'Creating...' : 'Submit Character'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="tibia-nav">
        <Link to="/my-characters" className="tibia-button">Back to My Characters</Link>
      </div>
    </div>
  );
};
