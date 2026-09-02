import { Character } from '../../domain/Character';
import { ICharacterRepository } from '../ports/outbound/ICharacterRepository';

export interface ListCharactersInput {
  ownerId?: string;
}

export class ListCharactersUseCase {
  constructor(private readonly characterRepository: ICharacterRepository) {}

  async execute(input: ListCharactersInput): Promise<Character[]> {
    if (input.ownerId) {
      return this.characterRepository.findByOwnerId(input.ownerId);
    }
    return this.characterRepository.findAll();
  }
}
