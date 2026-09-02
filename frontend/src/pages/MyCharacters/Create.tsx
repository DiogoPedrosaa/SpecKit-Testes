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
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Add Character</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ width: '100%' }}
          />
        </div>
        
        <div>
          <label>Level:</label>
          <input 
            type="number" 
            value={level} 
            onChange={(e) => setLevel(Number(e.target.value))} 
            min="1" 
            required 
            style={{ width: '100%' }}
          />
        </div>
        
        <div>
          <label>Vocation:</label>
          <select value={vocation} onChange={(e) => setVocation(e.target.value)} style={{ width: '100%' }}>
            <option value="Knight">Knight</option>
            <option value="Paladin">Paladin</option>
            <option value="Sorcerer">Sorcerer</option>
            <option value="Druid">Druid</option>
          </select>
        </div>
        
        <div>
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ width: '100%' }}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        
        <div>
          <label>World:</label>
          <input 
            type="text" 
            value={world} 
            onChange={(e) => setWorld(e.target.value)} 
            required 
            style={{ width: '100%' }}
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Character'}
        </button>
      </form>
      
      <div style={{ marginTop: '15px' }}>
        <Link to="/my-characters">Back to My Characters</Link>
      </div>
    </div>
  );
};
