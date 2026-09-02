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

  if (loading) return <div>Loading history...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My History</h2>
      <Link to="/dashboard">Back to Dashboard</Link>
      
      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <table border={1} cellPadding={10} style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Character</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.date).toLocaleString()}</td>
                <td>
                  {item.type === 'bid_won' && 'Bid Won'}
                  {item.type === 'bid_lost' && 'Bid Lost'}
                  {item.type === 'character_sold' && 'Character Sold'}
                  {item.type !== 'bid_won' && item.type !== 'bid_lost' && item.type !== 'character_sold' && item.type}
                </td>
                <td>{item.characterName}</td>
                <td>{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
