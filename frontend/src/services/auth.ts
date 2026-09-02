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
    const response = await api.post<any>('/auth/register', { name: username, email: username, password: passwordHash });
    return {
      user: { id: response.data.user.id, username: response.data.user.name, balance: response.data.user.freeBalance },
      token: response.data.token
    };
  },

  async login(username: string, passwordHash: string): Promise<AuthResponse> {
    const response = await api.post<any>('/auth/login', { email: username, password: passwordHash });
    return {
      user: { id: response.data.user.id, username: response.data.user.name, balance: response.data.user.freeBalance },
      token: response.data.token
    };
  },

  async addBalance(amount: number): Promise<void> {
    await api.post('/account/add-balance', { amount });
  },
  
  async getMe(): Promise<User> {
    const response = await api.get<any>('/users/me');
    return { id: response.data.id, username: response.data.name, balance: response.data.freeBalance };
  }
};
