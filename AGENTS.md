# Engineering Rules

## TDD

Nenhum código de produção deve ser criado sem um teste que falhe primeiro.

Seguir sempre:

RED → GREEN → REFACTOR

## Test Structure

Todos os testes devem utilizar:

Given / When / Then

ou

Arrange / Act / Assert.

## FIRST

Os testes devem ser:

Fast
Independent
Repeatable
Self-Validating
Timely

## Architecture

O backend deve seguir a **Arquitetura Hexagonal (Ports and Adapters)**.
Regras de negócio (domínio e casos de uso) não devem depender diretamente de:

- banco de dados;
- HTTP;
- frameworks;
- APIs externas;
- filesystem.

Dependências devem apontar para dentro da aplicação. Adaptadores de entrada devem lidar com interfaces externas (como HTTP) e adaptadores de saída devem implementar portas para persistência e serviços externos.

## Testing Strategy

Unit:
Regras de domínio.

Integration:
Comunicação entre componentes e infraestrutura.

E2E:
Fluxos críticos completos.

## Code Quality

Evitar:

- métodos longos;
- responsabilidades múltiplas;
- código duplicado;
- nomes ambíguos;
- números mágicos;
- condições profundamente aninhadas;
- código morto;
- exceções silenciosas;
- abstrações prematuras;
- complexidade desnecessária.

## Refactoring

Refatorar somente mantendo os testes verdes.

Nenhuma refatoração pode alterar comportamento sem atualizar primeiro a especificação e os testes.

## AI Behavior

Não inventar requisitos.

Não implementar funcionalidades não especificadas.

Não criar abstrações sem necessidade.

Antes de modificar código existente, entender seu comportamento atual através dos testes.

Sempre preferir a menor alteração necessária.