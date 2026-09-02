import React, { useEffect, useState } from 'react';
import { auctionService, type Auction } from '../services/auctions';
import { Link } from 'react-router-dom';

const AuctionItem: React.FC<{ auction: Auction; onBidSuccess: () => void }> = ({ auction, onBidSuccess }) => {
  const [bidAmount, setBidAmount] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await auctionService.placeBid(auction.id, Number(bidAmount));
      setMessage('Bid placed successfully!');
      onBidSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to place bid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
      {auction.character ? (
        <>
          <h2>{auction.character.name}</h2>
          <p><strong>Level:</strong> {auction.character.level}</p>
          <p><strong>Vocation:</strong> {auction.character.vocation}</p>
          <p><strong>World:</strong> {auction.character.world}</p>
        </>
      ) : (
        <h2>Character: {auction.characterId}</h2>
      )}
      <hr />
      <p><strong>Start Price:</strong> {auction.startPrice}</p>
      <p><strong>Current Bid:</strong> {auction.currentBid}</p>
      <p><strong>Ends at:</strong> {new Date(auction.endTime).toLocaleString()}</p>
      <hr />
      {auction.status === 'active' && (
        <form onSubmit={handleBid}>
          <div style={{ marginBottom: '10px' }}>
            <label>Bid Amount: </label>
            <input 
              type="number" 
              value={bidAmount} 
              onChange={(e) => setBidAmount(e.target.value === '' ? '' : Number(e.target.value))} 
              min={auction.currentBid > 0 ? auction.currentBid + 1 : auction.startPrice} 
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Placing bid...' : 'Place Bid'}
          </button>
          {message && <div style={{ color: 'green', marginTop: '10px' }}>{message}</div>}
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </form>
      )}
    </div>
  );
};

export const Home: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAuctions = async () => {
    try {
      const data = await auctionService.getAllAuctions();
      setAuctions(data);
    } catch (err) {
      setError('Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tibia Bazaar Clone</h1>
      <p>Welcome to Tibia Bazaar Clone. Here are the active auctions:</p>
      
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {auctions.map(auction => (
          <AuctionItem key={auction.id} auction={auction} onBidSuccess={fetchAuctions} />
        ))}
      </div>
      {auctions.length === 0 && <p>No active auctions found.</p>}

      <div style={{ marginTop: '20px' }}>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
};
