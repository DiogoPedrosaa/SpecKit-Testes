import { api } from './api';
import { type Character } from './characters';

export interface Auction {
  id: string;
  characterId: string;
  sellerId: string;
  startPrice: number;
  currentBid: number;
  endTime: string;
  status: 'active' | 'finished' | 'cancelled';
  character?: Character; // To populate character info
}

export interface CreateAuctionDTO {
  characterId: string;
  startPrice: number;
  endTime: string;
}

export const auctionService = {
  createAuction: async (data: CreateAuctionDTO): Promise<Auction> => {
    const response = await api.post<Auction>('/auctions', data);
    return response.data;
  },

  getAllAuctions: async (): Promise<Auction[]> => {
    const response = await api.get<Auction[]>('/auctions');
    return response.data;
  },

  placeBid: async (auctionId: string, amount: number): Promise<void> => {
    const response = await api.post(`/auctions/${auctionId}/bids`, { amount });
    return response.data;
  },

  getHistory: async (): Promise<any> => {
    const response = await api.get('/history');
    return response.data;
  }
};
