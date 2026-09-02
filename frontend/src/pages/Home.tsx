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
    <div className="tibia-box">
      {auction.character ? (
        <>
          <h2>{auction.character.name}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '10px' }}>
            <span><strong>Level:</strong> {auction.character.level}</span>
            <span><strong>Vocation:</strong> {auction.character.vocation}</span>
            <span><strong>World:</strong> {auction.character.world}</span>
          </div>
        </>
      ) : (
        <h2>Character: {auction.characterId}</h2>
      )}
      
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--tibia-border-dark)', padding: '5px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span><strong>Start Price:</strong></span>
          <span style={{ color: 'green', fontWeight: 'bold' }}>{auction.startPrice} TC</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span><strong>Current Bid:</strong></span>
          <span style={{ color: 'green', fontWeight: 'bold' }}>{auction.currentBid} TC</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span><strong>Ends at:</strong></span>
          <span>{new Date(auction.endTime).toLocaleString()}</span>
        </div>
      </div>

      {auction.status === 'active' && (
        <form onSubmit={handleBid} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold' }}>Your Bid: </label>
            <input 
              className="tibia-input"
              type="number" 
              value={bidAmount} 
              onChange={(e) => setBidAmount(e.target.value === '' ? '' : Number(e.target.value))} 
              min={auction.currentBid > 0 ? auction.currentBid + 1 : auction.startPrice} 
              required
              style={{ width: '80px' }}
            />
          </div>
          <button type="submit" className="tibia-button" disabled={loading} style={{ alignSelf: 'flex-end' }}>
            {loading ? 'Submitting...' : 'Submit Bid'}
          </button>
          {message && <div style={{ color: 'green', fontSize: '12px', textAlign: 'right' }}>{message}</div>}
          {error && <div style={{ color: 'red', fontSize: '12px', textAlign: 'right' }}>{error}</div>}
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

  return (
    <div className="tibia-container">
      <div className="tibia-header">
        <h1>Char Bazaar</h1>
        <p>Welcome to the Character Trade. Here you can buy and sell Tibia characters.</p>
      </div>
      
      {loading && <div>Loading auctions...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && !error && (
        <>
          <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {auctions.map(auction => (
              <AuctionItem key={auction.id} auction={auction} onBidSuccess={fetchAuctions} />
            ))}
          </div>
          {auctions.length === 0 && <p style={{ textAlign: 'center', marginTop: '20px' }}>No active auctions found.</p>}
        </>
      )}

      <div className="tibia-nav">
        <Link to="/login" className="tibia-button">Login</Link>
        <Link to="/register" className="tibia-button">Register</Link>
        <Link to="/dashboard" className="tibia-button">Dashboard</Link>
      </div>
    </div>
  );
};
