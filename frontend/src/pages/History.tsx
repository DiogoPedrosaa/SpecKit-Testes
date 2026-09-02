import React, { useEffect, useState } from 'react';
import { auctionService } from '../services/auctions';
import { Link } from 'react-router-dom';

interface HistoryItem {
  id: string;
  type: 'bid_won' | 'bid_lost' | 'character_sold';
  characterName: string;
  amount: number;
  date: string;
}

export const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await auctionService.getHistory();
        setHistory(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="tibia-container">
      <div className="tibia-header">
        <h1>My History</h1>
      </div>
      
      {loading && <div>Loading history...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {!loading && !error && history.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No history found.</p>
      ) : (!loading && !error && (
        <div className="tibia-box">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--tibia-border-dark)', backgroundColor: '#d4c0a1' }}>
                <th style={{ padding: '8px' }}>Date</th>
                <th style={{ padding: '8px' }}>Type</th>
                <th style={{ padding: '8px' }}>Character</th>
                <th style={{ padding: '8px' }}>Amount (TC)</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#f1e0c6' : '#e4d4b1', borderBottom: '1px solid var(--tibia-border-dark)' }}>
                  <td style={{ padding: '8px' }}>{new Date(item.date).toLocaleString()}</td>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>
                    {item.type === 'bid_won' && <span style={{ color: 'green' }}>Bid Won</span>}
                    {item.type === 'bid_lost' && <span style={{ color: 'red' }}>Bid Lost</span>}
                    {item.type === 'character_sold' && <span style={{ color: 'blue' }}>Character Sold</span>}
                    {item.type !== 'bid_won' && item.type !== 'bid_lost' && item.type !== 'character_sold' && item.type}
                  </td>
                  <td style={{ padding: '8px' }}>{item.characterName}</td>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="tibia-nav">
        <Link to="/dashboard" className="tibia-button">Back to Dashboard</Link>
      </div>
    </div>
  );
};
