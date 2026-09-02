# Tibia Bazaar - Estudos de Engenharia de Software 📚

Este projeto foi criado com o objetivo de estudar e aplicar **Boas Práticas de Desenvolvimento de Software**, inspirado e seguindo os conceitos do curso do **Rodrigo Branas**. 

Além dos estudos práticos de código, este projeto também serviu como ambiente de testes para a utilização do **GitHub SpecKit** (ferramenta de IA/Agentes para planejar, especificar e implementar funcionalidades seguindo um fluxo de trabalho estruturado).

## 🎯 Objetivos do Projeto

- Aplicar **TDD (Test-Driven Development)**: Red -> Green -> Refactor.
- Estruturar o backend utilizando **Arquitetura Hexagonal (Ports and Adapters)**.
- Garantir a independência de frameworks, banco de dados e APIs externas no core da aplicação.
- Escrever testes significativos (Unitários, Integração e E2E).
- Aplicar princípios de **Clean Code** e **SOLID**.

---

## 🛠️ Práticas Aplicadas & Exemplos de Código

Abaixo estão exemplos reais do código deste repositório que demonstram as práticas adotadas.

### 1. TDD (Test-Driven Development)

Nenhum código de produção é escrito sem que um teste falhe primeiro. A estrutura dos testes segue o padrão **Arrange / Act / Assert** (ou Given / When / Then). 

**Exemplo de Teste de Domínio (`backend/tests/unit/domain/User.spec.ts`):**
```typescript
import { describe, it, expect } from 'vitest'
import { User, InsufficientBalanceError } from '../../../src/modules/users/domain/User'

describe('User Entity', () => {
  it('should reserve balance and move to locked', () => {
    // Arrange
    const user = new User('1', 'Test', 'test@test.com', 'hash', 1000, 0)
    
    // Act
    user.reserveBalance(400)
    
    // Assert
    expect(user.freeBalance).toBe(600)
    expect(user.lockedBalance).toBe(400)
  })

  it('should throw when reserving more than free balance', () => {
    // Arrange
    const user = new User('1', 'Test', 'test@test.com', 'hash', 100, 0)
    
    // Act & Assert
    expect(() => user.reserveBalance(200)).toThrow(InsufficientBalanceError)
  })
})
```

**Código de Produção Implementado (`backend/src/modules/users/domain/User.ts`):**
```typescript
export class User {
  // ...
  reserveBalance(amount: number): void {
    if (this.freeBalance < amount) {
      throw new InsufficientBalanceError();
    }
    this.freeBalance -= amount;
    this.lockedBalance += amount;
  }
  // ...
}
```

---

### 2. Arquitetura Hexagonal (Ports and Adapters)

A regra de negócio e os casos de uso não dependem de detalhes de infraestrutura (banco de dados, rotas HTTP). Tudo se comunica através de **Portas (Interfaces)** e a infraestrutura implementa os **Adaptadores**.

#### A. O Core / Domínio (Entidade)
Livre de qualquer dependência externa, representa o negócio puro.
```typescript
// backend/src/modules/users/domain/User.ts
export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public passwordHash: string,
    public freeBalance: number = 0,
    public lockedBalance: number = 0
  ) {}

  addFreeBalance(amount: number): void {
    this.freeBalance += amount;
  }
}
```

#### B. A Porta de Saída (Outbound Port)
Uma interface definida pela camada de Aplicação. O caso de uso diz *o que* precisa, mas não *como* é feito (não importa se é Postgres, MongoDB ou em memória).
```typescript
// backend/src/modules/users/application/ports/outbound/IUserRepository.ts
import { User } from '../../../domain/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

#### C. O Caso de Uso (Application Service)
Orquestra o fluxo utilizando o domínio e as portas, mas ainda assim sem conhecer detalhes do banco de dados.
```typescript
// backend/src/modules/users/application/use-cases/AddBalanceUseCase.ts
import { IUserRepository } from '../ports/outbound/IUserRepository';
import { User } from '../../domain/User';

export class AddBalanceUseCase {
  // Injeção de dependência da porta (IUserRepository)
  constructor(private userRepository: IUserRepository) {}

  async execute(input: { userId: string; amount: number }): Promise<User> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Regra de domínio sendo chamada
    user.addFreeBalance(input.amount);
    
    // Persistência através da porta
    await this.userRepository.save(user);

    return user;
  }
}
```

---

## 🤖 Uso do SpecKit

Durante o desenvolvimento deste repositório, o **SpecKit** foi utilizado para:
1. Analisar as descrições em linguagem natural.
2. Gerar especificações (`spec.md`).
3. Criar planos de arquitetura técnica (`plan.md`).
4. Quebrar o trabalho em tarefas executáveis (`tasks.md`).

Isso ajudou a manter as *Engineering Rules* documentadas em `AGENTS.md` sempre em foco antes mesmo de qualquer código ser gerado.
