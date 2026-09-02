import { api } from './api';

export interface User {
  id: string;
  username: string;
  balance: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async register(username: string, passwordHash: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', { username, password: passwordHash });
    return response.data;
  },

  async login(username: string, passwordHash: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { username, password: passwordHash });
    return response.data;
  },

  async addBalance(amount: number): Promise<void> {
    await api.post('/users/balance', { amount });
  },
  
  async getMe(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  }
};
