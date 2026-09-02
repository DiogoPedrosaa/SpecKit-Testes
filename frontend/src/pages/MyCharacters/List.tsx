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

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Characters</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ marginBottom: '20px' }}>
        <Link to="/my-characters/new">
          <button>Add New Character</button>
        </Link>
        <Link to="/dashboard" style={{ marginLeft: '10px' }}>
          Back to Dashboard
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {characters.map(char => (
          <div key={char.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h2>{char.name}</h2>
            <p><strong>Level:</strong> {char.level}</p>
            <p><strong>Vocation:</strong> {char.vocation}</p>
            <p><strong>Gender:</strong> {char.gender}</p>
            <p><strong>World:</strong> {char.world}</p>
            <div style={{ marginTop: '10px' }}>
              <Link to={`/my-characters/${char.id}/auction`}>
                <button>Create Auction</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {characters.length === 0 && <p>You have no characters yet.</p>}
    </div>
  );
};
