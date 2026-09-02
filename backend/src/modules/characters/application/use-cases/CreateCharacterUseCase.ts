import { Character } from '../../domain/Character';
import { ICharacterRepository } from '../ports/outbound/ICharacterRepository';

export interface CreateCharacterInput {
  name: string;
  level: number;
  vocation: string;
  ownerId: string;
}

export class CreateCharacterUseCase {
  constructor(private readonly characterRepository: ICharacterRepository) {}

  async execute(input: CreateCharacterInput): Promise<Character> {
    const id = Math.random().toString(36).substring(2, 9); // Simple ID generation, or use crypto/uuid
    const character = new Character(
      id,
      input.name,
      input.level,
      input.vocation,
      input.ownerId
    );
    await this.characterRepository.save(character);
    return character;
  }
}
