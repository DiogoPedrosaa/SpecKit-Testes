import jwt from 'jsonwebtoken';
import { ITokenPort } from '../../application/ports/outbound/ITokenPort';
import { config } from 'dotenv';

config();

export class JwtTokenAdapter implements ITokenPort {
  private get secret() {
    return process.env.JWT_SECRET || 'fallback_secret_key';
  }

  sign(payload: any): string {
    return jwt.sign(payload, this.secret, { expiresIn: '1d' });
  }

  verify(token: string): any {
    return jwt.verify(token, this.secret);
  }
}
