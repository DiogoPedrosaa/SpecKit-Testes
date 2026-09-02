import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    <div style={{ padding: '20px' }}>
      <h1>Create Auction</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
        <div>
          <label>Start Price:</label>
          <input
            type="number"
            value={startPrice}
            onChange={(e) => setStartPrice(e.target.value)}
            required
            min="0"
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Auction'}
        </button>
        <button type="button" onClick={() => navigate('/my-characters')}>
          Cancel
        </button>
      </form>
    </div>
  );
};
