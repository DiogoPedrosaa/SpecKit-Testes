import React, { useEffect, useState } from 'react';
import { characterService, type Character } from '../../services/characters';
import { Link } from 'react-router-dom';

export const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyCharacters = async () => {
      try {
        const data = await characterService.getMyCharacters();
        setCharacters(data);
      } catch (err) {
        setError('Failed to load your characters');
      } finally {
        setLoading(false);
      }
    };

    fetchMyCharacters();
  }, []);

  return (
    <div className="tibia-container">
      <div className="tibia-header">
        <h1>My Characters</h1>
      </div>
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading && <div>Loading...</div>}

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Link to="/my-characters/new" className="tibia-button" style={{ marginRight: '10px' }}>
          Add New Character
        </Link>
      </div>

      {!loading && !error && (
        <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {characters.map(char => (
            <div key={char.id} className="tibia-box">
              <h2>{char.name}</h2>
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--tibia-border-dark)', padding: '5px', marginBottom: '10px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>Level:</strong> {char.level}</span>
                  <span><strong>Vocation:</strong> {char.vocation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                  <span><strong>Gender:</strong> {char.gender}</span>
                  <span><strong>World:</strong> {char.world}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Link to={`/my-characters/${char.id}/auction`} className="tibia-button">
                  Create Auction
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && characters.length === 0 && (
        <p style={{ textAlign: 'center' }}>You have no characters yet.</p>
      )}

      <div className="tibia-nav">
        <Link to="/dashboard" className="tibia-button">Back to Dashboard</Link>
      </div>
    </div>
  );
};
