import bcrypt from 'bcrypt';
import { IHasherPort } from '../../application/ports/outbound/IHasherPort';

export class BcryptHasher implements IHasherPort {
  private readonly saltRounds = 10;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
