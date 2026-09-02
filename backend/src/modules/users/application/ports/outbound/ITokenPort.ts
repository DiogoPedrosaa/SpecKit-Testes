export interface ITokenPort {
  sign(payload: any): string;
  verify(token: string): any;
}
