import { api } from './api';

export interface Character {
  id: string;
  name: string;
  level: number;
  vocation: string;
  gender: string;
  world: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCharacterDTO {
  name: string;
  level: number;
  vocation: string;
  gender: string;
  world: string;
}

export const characterService = {
  createCharacter: async (data: CreateCharacterDTO) => {
    const response = await api.post<Character>('/characters', data);
    return response.data;
  },

  getMyCharacters: async () => {
    const response = await api.get<Character[]>('/characters/me');
    return response.data;
  },

  getAllCharacters: async () => {
    const response = await api.get<Character[]>('/characters');
    return response.data;
  }
};
