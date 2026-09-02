<!--
Sync Impact Report:
- Version change: Unversioned -> 1.0.0
- List of modified principles:
  - Initialized Principle 1: Hexagonal Architecture (Backend)
  - Initialized Principle 2: Test-Driven Development (TDD)
  - Initialized Principle 3: Testing Strategy & FIRST
  - Initialized Principle 4: Code Quality & Refactoring
  - Initialized Principle 5: AI Behavior
- Added sections: Engineering Rules
- Removed sections: N/A
- Templates requiring updates (✅ updated / ⚠ pending): 
  - .specify/templates/plan-template.md: ✅ updated
  - .specify/templates/spec-template.md: ✅ verified
  - .specify/templates/tasks-template.md: ✅ updated
- Follow-up TODOs: N/A
-->
# Tibia Bazaar Constitution

## Core Principles

### I. Hexagonal Architecture (Backend)
A arquitetura MUST ser Hexagonal (Ports and Adapters). O domínio e os casos de uso MUST permanecer independentes de frameworks, banco de dados, HTTP e serviços externos. Dependências MUST apontar para dentro da aplicação. Adaptadores de entrada MUST lidar com interfaces externas como HTTP. Adaptadores de saída MUST implementar portas utilizadas pelo domínio/aplicação para persistência e serviços externos. A arquitetura MUST priorizar testabilidade e baixo acoplamento.

### II. Test-Driven Development (TDD)
Nenhum código de produção MUST ser criado sem um teste que falhe primeiro. Seguir sempre o fluxo RED → GREEN → REFACTOR. Nenhuma refatoração pode alterar comportamento sem atualizar primeiro a especificação e os testes.

### III. Testing Strategy & FIRST
Todos os testes MUST utilizar a estrutura Given/When/Then ou Arrange/Act/Assert. Os testes MUST ser FIRST (Fast, Independent, Repeatable, Self-Validating, Timely).
- **Unitários**: Testar regras de domínio.
- **Integração**: Testar comunicação entre componentes e infraestrutura.
- **E2E**: Testar fluxos críticos completos.

### IV. Code Quality & Refactoring
Evitar: métodos longos, responsabilidades múltiplas, código duplicado, nomes ambíguos, números mágicos, condições profundamente aninhadas, código morto, exceções silenciosas, abstrações prematuras e complexidade desnecessária. Sempre preferir a menor alteração necessária. A refatoração MUST manter os testes verdes e não alterar comportamento não especificado.

### V. AI Behavior
Não inventar requisitos. Não implementar funcionalidades não especificadas. Não criar abstrações sem necessidade. Antes de modificar código existente, entender seu comportamento atual através dos testes.

## Additional Constraints

(No additional constraints at this time)

## Development Workflow

Todo desenvolvimento de feature MUST ser conduzido por especificações claras (`spec.md`), planejamento arquitetural validado e divisão de tarefas baseada em testes (`tasks.md`).

## Governance

This constitution supersedes all other practices. Amendments require documentation, approval, and a migration plan if applicable. All PRs/reviews MUST verify compliance. Complexity MUST be justified. Use `AGENTS.md` for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-09-02 | **Last Amended**: 2026-09-02
