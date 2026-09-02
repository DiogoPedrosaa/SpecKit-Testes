import { characterController } from '../../modules/characters/adapters/inbound/characterController';
import { MongoCharacterRepository } from '../../modules/characters/adapters/outbound/MongoCharacterRepository';
import { CreateCharacterUseCase } from '../../modules/characters/application/use-cases/CreateCharacterUseCase';
import { ListCharactersUseCase } from '../../modules/characters/application/use-cases/ListCharactersUseCase';

export function makeCharacterController() {
  const repository = new MongoCharacterRepository();
  const createCharacterUseCase = new CreateCharacterUseCase(repository);
  const listCharactersUseCase = new ListCharactersUseCase(repository);
  return characterController(createCharacterUseCase, listCharactersUseCase);
}
