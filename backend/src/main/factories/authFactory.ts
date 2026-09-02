import { MongoUserRepository } from '../../modules/users/adapters/outbound/MongoUserRepository';
import { BcryptHasher } from '../../modules/users/adapters/outbound/BcryptHasher';
import { JwtTokenAdapter } from '../../modules/users/adapters/outbound/JwtTokenAdapter';
import { RegisterUserUseCase } from '../../modules/users/application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../modules/users/application/use-cases/LoginUserUseCase';
import { AddBalanceUseCase } from '../../modules/users/application/use-cases/AddBalanceUseCase';
import { authController } from '../../modules/users/adapters/inbound/authController';

export function makeAuthController() {
  const userRepository = new MongoUserRepository();
  const hasher = new BcryptHasher();
  const tokenPort = new JwtTokenAdapter();

  const registerUseCase = new RegisterUserUseCase(userRepository, hasher, tokenPort);
  const loginUseCase = new LoginUserUseCase(userRepository, hasher, tokenPort);
  const addBalanceUseCase = new AddBalanceUseCase(userRepository);

  return authController(registerUseCase, loginUseCase, addBalanceUseCase);
}
