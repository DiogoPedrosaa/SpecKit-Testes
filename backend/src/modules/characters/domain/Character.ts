export class Character {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly level: number,
    public readonly vocation: string,
    public readonly ownerId: string
  ) {}
}
