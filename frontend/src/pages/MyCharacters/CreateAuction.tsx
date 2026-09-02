import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { auctionService } from '../../services/auctions';

export const CreateAuction: React.FC = () => {
  const { id: characterId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [startPrice, setStartPrice] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterId) return;

    try {
      setLoading(true);
      setError('');
      await auctionService.createAuction({
        characterId,
        startPrice: Number(startPrice),
        endTime,
      });
      navigate('/my-characters');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create auction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tibia-container" style={{ width: '500px' }}>
      <div className="tibia-header">
        <h1>Create Auction</h1>
      </div>
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      <div className="tibia-box">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Start Price (Tibia Coins):</label>
            <input
              className="tibia-input"
              type="number"
              value={startPrice}
              onChange={(e) => setStartPrice(e.target.value)}
              required
              min="0"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>End Time:</label>
            <input
              className="tibia-input"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button type="submit" className="tibia-button" disabled={loading}>
              {loading ? 'Creating...' : 'Submit Auction'}
            </button>
            <button type="button" className="tibia-button" onClick={() => navigate('/my-characters')}>
              Cancel
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
